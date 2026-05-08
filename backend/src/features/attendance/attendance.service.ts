import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { SharpHelper } from "src/cores/helpers/sharp.helper";
import { AttendanceImage } from "../attendance-image/entities/attendance-image.entity";
import { AttendanceSetting } from "../attendance-setting/entities/attendance-setting.entity";
import { Permit } from "../permit/entities/permit.entity";
import { User } from "../user/entities/user.entity";
import UserRoleEnum from "../user/enums/user-role.enum";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { Attendance } from "./entities/attendance.entity";

const ALLOWED_ROLES = [UserRoleEnum.EMPLOYEE, UserRoleEnum.INTERN];
const WORDS_PER_LATE_MINUTE = 60;
const FACE_CONFIDENCE_THRESHOLD = 50;

@Injectable()
export class AttendanceService {
  private readonly attendanceTimeZone = "Asia/Jakarta";
  private readonly attendanceTimeZoneOffset = "+07:00";

  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(Attendance)
    private readonly attendanceModel: typeof Attendance,
    @InjectModel(AttendanceImage)
    private readonly attendanceImageModel: typeof AttendanceImage,
    @InjectModel(AttendanceSetting)
    private readonly attendanceSettingModel: typeof AttendanceSetting,
    @InjectModel(Permit)
    private readonly permitModel: typeof Permit,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  private getDateTimeParts(date: Date) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: this.attendanceTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .formatToParts(date)
      .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {} as any);
  }

  private getNow(): Date {
    const p = this.getDateTimeParts(new Date());
    return new Date(
      `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}.000${this.attendanceTimeZoneOffset}`,
    );
  }

  private getTodayStart(): Date {
    const p = this.getDateTimeParts(new Date());
    return new Date(
      `${p.year}-${p.month}-${p.day}T00:00:00.000${this.attendanceTimeZoneOffset}`,
    );
  }

  private parseTimeOnDate(date: Date, time: string): Date {
    const [h, m, s] = time.split(":").map(Number);
    const p = this.getDateTimeParts(date);
    return new Date(
      `${p.year}-${p.month}-${p.day}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s || 0).padStart(2, "0")}.000${this.attendanceTimeZoneOffset}`,
    );
  }

  private getLateDuration(clockIn: Date, checkInTime: string): number {
    const diff =
      clockIn.getTime() - this.parseTimeOnDate(clockIn, checkInTime).getTime();
    return diff > 0 ? Math.floor(diff / 60000) : 0;
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  private getDistanceMeters(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371000;
    const rad = (v: number) => (v * Math.PI) / 180;
    const dLat = rad(lat2 - lat1);
    const dLng = rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private validateGps(
    gps_lat: string,
    gps_lng: string,
    setting: AttendanceSetting,
  ): string | null {
    const currentLat = +gps_lat;
    const currentLng = +gps_lng;
    const settingLat = +setting.gps_lat;
    const settingLng = +setting.gps_lng;

    if ([currentLat, currentLng, settingLat, settingLng].some(Number.isNaN)) {
      return "Invalid GPS coordinate format";
    }

    const distance = this.getDistanceMeters(
      settingLat,
      settingLng,
      currentLat,
      currentLng,
    );
    if (distance > setting.radius_meter) {
      return `Anda berada ${Math.ceil(distance)}m dari lokasi absensi`;
    }

    return null;
  }

  private lateNoteResult(lateDuration: number, note: string) {
    const requiredWords = lateDuration * WORDS_PER_LATE_MINUTE;
    const currentWords = this.countWords(note || "");
    const missingWords =
      lateDuration > 0 ? Math.max(requiredWords - currentWords, 0) : 0;
    return { requiredWords, currentWords, missingWords };
  }

  private isWeekend(dateStr: string): boolean {
    const date = new Date(dateStr);
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  private async verifyFaceWithAi(image: Express.Multer.File) {
    const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
    const mime = image.mimetype || "image/jpeg";
    const imageBase64 = `data:${mime};base64,${image.buffer.toString("base64")}`;

    const response = await fetch(`${aiUrl}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_base64: imageBase64 }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error || "Face verification service failed");
    }

    return result as {
      matched: boolean;
      name: string | null;
      confidence: number | null;
      error: string | null;
    };
  }

  async quickCheckIn(dto: CreateAttendanceDto, image?: Express.Multer.File) {
    if (!image) {
      return this.response.fail("Attendance image is required", 400);
    }

    let verifyResult: Awaited<ReturnType<typeof this.verifyFaceWithAi>>;
    try {
      verifyResult = await this.verifyFaceWithAi(image);
    } catch (error: any) {
      return this.response.fail(error.message || "Face verification failed", 400);
    }

    if (verifyResult.error === "no_face") {
      return this.response.fail(
        "Wajah tidak terdeteksi, pastikan wajah terlihat jelas di kamera",
        400,
      );
    }

    if (!verifyResult.matched || !verifyResult.name) {
      return this.response.fail(
        "Wajah tidak dikenali, absen gagal ditambahkan",
        400,
      );
    }

    const attendanceUser = await this.userModel.findOne({
      where: {
        name: verifyResult.name,
        role: { [Op.in]: ALLOWED_ROLES },
        is_active: true,
      },
    });

    if (!attendanceUser) {
      return this.response.fail(
        `User ${verifyResult.name} tidak ditemukan atau tidak aktif`,
        404,
      );
    }

    const response: any = await this.checkIn(
      attendanceUser,
      {
        ...dto,
        face_confidence: Number(verifyResult.confidence),
      },
      image,
    );

    response.data.recognized_user = {
      id: attendanceUser.id,
      name: attendanceUser.name,
    };

    return response;
  }

  async checkIn(
    user: User,
    dto: CreateAttendanceDto,
    image?: Express.Multer.File,
  ) {
    if (!ALLOWED_ROLES.includes(user.role)) {
      return this.response.fail("Only employee or intern can check in", 403);
    }

    const setting = await this.attendanceSettingModel.findOne({
      order: [["id", "DESC"]],
    });
    if (!setting)
      return this.response.fail("Attendance setting not found", 404);

    if (!dto.gps_lat || !dto.gps_lng) {
      return this.response.fail("GPS latitude and longitude are required", 400);
    }

    if (dto.face_confidence == null || Number.isNaN(dto.face_confidence)) {
      return this.response.fail("Face confidence is required", 400);
    }

    if (dto.face_confidence <= FACE_CONFIDENCE_THRESHOLD) {
      return this.response.fail("Face verification failed", 400);
    }

    if (!image) {
      return this.response.fail("Attendance image is required", 400);
    }

    const gpsError = this.validateGps(dto.gps_lat, dto.gps_lng, setting);
    if (gpsError) return this.response.fail(gpsError, 400);

    const existing = await this.attendanceModel.findOne({
      where: {
        user_id: user.id,
        clock_in: { [Op.gte]: this.getTodayStart() },
      },
    });
    if (existing) return this.response.fail("Anda sudah check in hari ini", 400);

    const clockIn = this.getNow();
    const lateDuration = this.getLateDuration(clockIn, setting.check_in_time);
    const { requiredWords, currentWords, missingWords } = this.lateNoteResult(
      lateDuration,
      dto.note || "",
    );

    const transaction = await this.sequelize.transaction();
    try {
      const sharpHelper = new SharpHelper();
      const uploadResult = await sharpHelper.resizeAndUpload(image, {
        path: Attendance.imageOption.path,
      });

      const attendance = await this.attendanceModel.create(
        {
          user_id: user.id,
          created_by: user.id,
          clock_in: clockIn,
          is_late: lateDuration > 0,
          late_duration: lateDuration,
          gps_lat: dto.gps_lat,
          gps_lng: dto.gps_lng,
          note: dto.note ?? null,
          attendance_setting_id: setting.id,
          face_confidence: dto.face_confidence ?? null,
          is_face_verified: dto.face_confidence > FACE_CONFIDENCE_THRESHOLD,
        },
        { transaction },
      );

      await this.attendanceImageModel.create(
        {
          attendance_id: attendance.id,
          file_path: uploadResult.file_path,
          url: uploadResult.url,
        },
        { transaction },
      );
      await transaction.commit();

      return this.response.success(
        {
          attendance,
          late_note_requirement: {
            is_required: lateDuration > 0,
            required_words: requiredWords,
            current_words: currentWords,
            additional_words_needed: missingWords,
            is_fulfilled: missingWords === 0,
          },
        },
        201,
        missingWords > 0
          ? `Checked in. You are late ${lateDuration} min(s), add ${missingWords} more words`
          : "Successfully checked in",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async checkOut(user: User, dto: CreateAttendanceDto) {
    if (!ALLOWED_ROLES.includes(user.role)) {
      return this.response.fail("Only employee or intern can check out", 403);
    }

    if (!dto.gps_lat || !dto.gps_lng) {
      return this.response.fail("GPS latitude and longitude are required", 400);
    }

    const attendance = await this.attendanceModel.findOne({
      where: {
        user_id: user.id,
        clock_in: { [Op.gte]: this.getTodayStart() },
        clock_out: null,
      },
    });
    if (!attendance)
      return this.response.fail("No active check-in found for today", 404);

    const setting = await this.attendanceSettingModel.findOne({
      order: [["id", "DESC"]],
    });
    if (setting) {
      const gpsError = this.validateGps(dto.gps_lat, dto.gps_lng, setting);
      if (gpsError) return this.response.fail(gpsError, 400);
    }

    const transaction = await this.sequelize.transaction();
    try {
      await attendance.update(
        {
          clock_out: this.getNow(),
          gps_lat: dto.gps_lat,
          gps_lng: dto.gps_lng,
          note: dto.note ?? attendance.note,
        },
        { transaction },
      );
      await transaction.commit();

      return this.response.success(attendance, 200, "Successfully checked out");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async today(user: User) {
    const attendance = await this.attendanceModel.findOne({
      where: {
        user_id: user.id,
        clock_in: { [Op.gte]: this.getTodayStart() },
      },
      include: ["attendance_setting"],
    });

    return this.response.success(
      {
        has_checked_in: !!attendance,
        has_checked_out: !!attendance?.clock_out,
        attendance: attendance ?? null,
      },
      200,
      "Successfully get today attendance",
    );
  }

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.attendanceModel,
        query,
      )
        .load("user", "created_by_user", "attendance_setting")
        .getResult();
      return this.response.success(
        { count, attendances: data },
        200,
        "Successfully get attendances",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(attendance: Attendance) {
    try {
      await attendance.reload({
        include: [
          "user",
          "created_by_user",
          "attendance_images",
          "attendance_setting",
        ],
      });
      return this.response.success(
        attendance,
        200,
        "Successfully get attendance",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async updateLateNote(
    attendance: Attendance,
    user: User,
    updateAttendanceDto: UpdateAttendanceDto,
  ) {
    if (attendance.user_id !== user.id) {
      return this.response.fail(
        "You can only update late note for your own attendance",
        403,
      );
    }
    if (!attendance.is_late) {
      return this.response.fail(
        "Late note can only be updated for late attendance",
        400,
      );
    }

    const { requiredWords, currentWords, missingWords } = this.lateNoteResult(
      attendance.late_duration,
      updateAttendanceDto.note || "",
    );

    if (missingWords > 0) {
      return this.response.fail(
        `You are late ${attendance.late_duration} minute(s), add ${missingWords} words more`,
        400,
      );
    }

    const transaction = await this.sequelize.transaction();
    try {
      await attendance.update(
        { note: updateAttendanceDto.note },
        { transaction },
      );
      await transaction.commit();

      return this.response.success(
        {
          attendance,
          late_note_requirement: {
            is_required: true,
            required_words: requiredWords,
            current_words: currentWords,
            additional_words_needed: 0,
            is_fulfilled: true,
          },
        },
        200,
        "Late note fulfilled",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async getAttendanceHistory(user: User, query: any) {
    try {
      const start = new Date(
        `${query.start_date}T00:00:00.000${this.attendanceTimeZoneOffset}`,
      );
      const end = new Date(
        `${query.end_date}T23:59:59.999${this.attendanceTimeZoneOffset}`,
      );

      const attendanceWhere: any = {
        clock_in: { [Op.between]: [start, end] },
      };

      if (user.role !== UserRoleEnum.HIRING_MANAGER) {
        attendanceWhere.user_id = user.id;
      }

      const attendances = await this.attendanceModel.findAll({
        where: attendanceWhere,
        include: ["user"],
      });

      const permitWhere: any = {
        status: 1,
        [Op.or]: [
          { date_start: { [Op.between]: [start, end] } },
          { date_end: { [Op.between]: [start, end] } },
          {
            date_start: { [Op.lte]: start },
            date_end: { [Op.gte]: end },
          },
        ],
      };

      if (user.role !== UserRoleEnum.HIRING_MANAGER) {
        permitWhere.user_id = user.id;
      }

      const permits = await this.permitModel.findAll({
        where: permitWhere,
        include: ["user"],
      });

      let users: User[] = [];

      if (user.role === UserRoleEnum.HIRING_MANAGER) {
        users = await User.findAll({
          where: {
            role: [UserRoleEnum.EMPLOYEE, UserRoleEnum.INTERN],
          },
        });
      } else {
        users = [user];
      }

      const map = new Map<string, any>();

      for (const permit of permits as any[]) {
        const current = new Date(permit.date_start);
        const endDate = new Date(permit.date_end);

        while (current <= endDate) {
          const dateStr = current.toLocaleDateString("en-CA", {
            timeZone: this.attendanceTimeZone,
          });

          const key = `${permit.user_id}-${dateStr}`;

          map.set(key, {
            user: permit.user,
            user_id: permit.user_id,
            date: dateStr,
            status: "permit",
            source: "permit",
            permit_id: permit.id,
            permit_type: permit.type,
            permit_type_name: permit.type_name,
            note: permit.description,
          });

          current.setDate(current.getDate() + 1);
        }
      }

      for (const att of attendances as Attendance[]) {
        const dateStr = att.clock_in.toLocaleDateString("en-CA", {
          timeZone: this.attendanceTimeZone,
        });

        const key = `${att.user_id}-${dateStr}`;

        if (!map.has(key)) {
          map.set(key, {
            user: att.user,
            user_id: att.user_id,
            date: dateStr,
            status: att.is_late ? "late" : "present",
            source: "attendance",
            attendance_id: att.id,
            clock_in: att.clock_in,
            clock_out: att.clock_out,
            gps_lat: att.gps_lat,
            gps_lng: att.gps_lng,
            late_duration: att.late_duration,
            note: att.note,
          });
        }
      }

      const dates: string[] = [];
      const current = new Date(start);

      while (current <= end) {
        dates.push(
          current.toLocaleDateString("en-CA", {
            timeZone: this.attendanceTimeZone,
          }),
        );
        current.setDate(current.getDate() + 1);
      }

      const final = [];

      for (const u of users) {
        for (const d of dates) {
          const key = `${u.id}-${d}`;

          if (map.has(key)) {
            final.push(map.get(key));
          } else if (this.isWeekend(d)) {
            final.push({
              user: u,
              user_id: u.id,
              date: d,
              status: "weekend",
              source: "system",
            });
          } else {
            final.push({
              user: u,
              user_id: u.id,
              date: d,
              status: "absent",
              source: "system",
            });
          }
        }
      }

      final.sort((a, b) => {
        if (a.date === b.date) return a.user_id - b.user_id;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      return this.response.success(
        {
          count: final.length,
          history: final,
        },
        200,
        "Attendance history retrieved successfully",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async remove(attendance: Attendance) {
    const transaction = await this.sequelize.transaction();
    try {
      await attendance.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, "Successfully delete attendance");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
