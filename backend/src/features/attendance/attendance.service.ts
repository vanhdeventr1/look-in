import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { AttendanceSetting } from "../attendance-setting/entities/attendance-setting.entity";
import { User } from "../user/entities/user.entity";
import UserRoleEnum from "../user/enums/user-role.enum";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { Attendance } from "./entities/attendance.entity";

const ALLOWED_ROLES = [UserRoleEnum.EMPLOYEE, UserRoleEnum.INTERN];
const WORDS_PER_LATE_MINUTE = 60;

@Injectable()
export class AttendanceService {
  private readonly attendanceTimeZone = "Asia/Jakarta";
  private readonly attendanceTimeZoneOffset = "+07:00";

  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(Attendance)
    private readonly attendanceModel: typeof Attendance,
    @InjectModel(AttendanceSetting)
    private readonly attendanceSettingModel: typeof AttendanceSetting,
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
      return `You are ${Math.ceil(distance)}m away from attendance location`;
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

  async checkIn(user: User, dto: CreateAttendanceDto) {
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

    const gpsError = this.validateGps(dto.gps_lat, dto.gps_lng, setting);
    if (gpsError) return this.response.fail(gpsError, 400);

    const existing = await this.attendanceModel.findOne({
      where: {
        user_id: user.id,
        clock_in: { [Op.gte]: this.getTodayStart() },
      },
    });
    if (existing) return this.response.fail("Already checked in today", 400);

    const clockIn = this.getNow();
    const lateDuration = this.getLateDuration(clockIn, setting.check_in_time);
    const { requiredWords, currentWords, missingWords } = this.lateNoteResult(
      lateDuration,
      dto.note || "",
    );

    const transaction = await this.sequelize.transaction();
    try {
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

  // async create(createAttendanceDto: CreateAttendanceDto, user: User) {
  //   if (!ALLOWED_ROLES.includes(user.role)) {
  //     return this.response.fail(
  //       "Only employee or intern can take attendance",
  //       403,
  //     );
  //   }

  //   const setting = await this.attendanceSettingModel.findOne({
  //     order: [["id", "DESC"]],
  //   });
  //   if (!setting)
  //     return this.response.fail("Attendance setting not found", 404);

  //   if (!createAttendanceDto.gps_lat || !createAttendanceDto.gps_lng) {
  //     return this.response.fail("GPS latitude and longitude are required", 400);
  //   }

  //   const gpsError = this.validateGps(
  //     createAttendanceDto.gps_lat,
  //     createAttendanceDto.gps_lng,
  //     setting,
  //   );
  //   if (gpsError) return this.response.fail(gpsError, 400);

  //   const clockIn = this.getNow();
  //   const lateDuration = this.getLateDuration(clockIn, setting.check_in_time);
  //   const { requiredWords, currentWords, missingWords } = this.lateNoteResult(
  //     lateDuration,
  //     createAttendanceDto.note || "",
  //   );

  //   const transaction = await this.sequelize.transaction();
  //   try {
  //     const attendance = await this.attendanceModel.create(
  //       {
  //         ...createAttendanceDto,
  //         clock_in: clockIn,
  //         is_late: lateDuration > 0,
  //         late_duration: lateDuration,
  //         attendance_setting_id: setting.id,
  //         user_id: user.id,
  //         created_by: user.id,
  //       },
  //       { transaction },
  //     );
  //     await transaction.commit();

  //     return this.response.success(
  //       {
  //         attendance,
  //         late_note_requirement: {
  //           is_required: lateDuration > 0,
  //           required_words: requiredWords,
  //           current_words: currentWords,
  //           additional_words_needed: missingWords,
  //           is_fulfilled: missingWords === 0,
  //         },
  //       },
  //       201,
  //       missingWords > 0
  //         ? `Attendance recorded. You are late ${lateDuration} minute(s), add ${missingWords} words more`
  //         : "Successfully create attendance",
  //     );
  //   } catch (error) {
  //     await transaction.rollback();
  //     return this.response.fail(error, 400);
  //   }
  // }

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.attendanceModel,
        query,
      )
        .load("user", "created_by_user", "attendance_setting", "permit")
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
          "permit",
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
