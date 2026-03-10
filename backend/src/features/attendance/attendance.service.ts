import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { AttendanceSetting } from "../attendance-setting/entities/attendance-setting.entity";
import { User } from "../user/entities/user.entity";
import UserRoleEnum from "../user/enums/user-role.enum";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateLateNoteDto } from "./dto/update-late-note.dto";
import { Attendance } from "./entities/attendance.entity";

@Injectable()
export class AttendanceService {
  private readonly attendanceTimeZone = "Asia/Jakarta";
  private readonly attendanceTimeZoneOffset = "+07:00";
  private readonly lateNoteRequiredWordsPerMinute = 60;

  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(Attendance)
    private readonly attendanceModel: typeof Attendance,
    @InjectModel(AttendanceSetting)
    private readonly attendanceSettingModel: typeof AttendanceSetting,
  ) {}

  private pad2(value: number): string {
    return value.toString().padStart(2, "0");
  }

  private getDateTimePartsInTimeZone(date: Date, timeZone: string) {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const get = (type: string) =>
      parts.find((value) => value.type === type)?.value || "00";

    return {
      year: get("year"),
      month: get("month"),
      day: get("day"),
      hour: get("hour"),
      minute: get("minute"),
      second: get("second"),
    };
  }

  private getNowInAttendanceTimeZone(): Date {
    const now = new Date();
    const nowParts = this.getDateTimePartsInTimeZone(
      now,
      this.attendanceTimeZone,
    );

    return new Date(
      `${nowParts.year}-${nowParts.month}-${nowParts.day}T${nowParts.hour}:${nowParts.minute}:${nowParts.second}.000${this.attendanceTimeZoneOffset}`,
    );
  }

  private parseTimeOnDate(date: Date, time: string): Date {
    const [hour, minute, second] = time.split(":").map((value) => +value || 0);
    const dateParts = this.getDateTimePartsInTimeZone(
      date,
      this.attendanceTimeZone,
    );

    return new Date(
      `${dateParts.year}-${dateParts.month}-${dateParts.day}T${this.pad2(hour)}:${this.pad2(minute)}:${this.pad2(second)}.000${this.attendanceTimeZoneOffset}`,
    );
  }

  private calculateLateDuration(clockIn: Date, checkInTime: string): number {
    const scheduleTime = this.parseTimeOnDate(clockIn, checkInTime);
    const diffMs = clockIn.getTime() - scheduleTime.getTime();

    if (diffMs <= 0) {
      return 0;
    }

    return Math.floor(diffMs / (1000 * 60));
  }

  private calculateDistanceMeters(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
  ): number {
    const earthRadius = 6371000;
    const degToRad = (value: number) => (value * Math.PI) / 180;

    const latitudeDiff = degToRad(toLat - fromLat);
    const longitudeDiff = degToRad(toLng - fromLng);
    const a =
      Math.sin(latitudeDiff / 2) ** 2 +
      Math.cos(degToRad(fromLat)) *
        Math.cos(degToRad(toLat)) *
        Math.sin(longitudeDiff / 2) ** 2;

    return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  async create(createAttendanceDto: CreateAttendanceDto, user: User) {
    if (![UserRoleEnum.EMPLOYEE, UserRoleEnum.INTERN].includes(user.role)) {
      return this.response.fail(
        "Only employee or intern can take attendance",
        403,
      );
    }

    const attendanceSetting = await this.attendanceSettingModel.findOne({
      order: [["id", "DESC"]],
    });
    if (!attendanceSetting) {
      return this.response.fail("Attendance setting not found", 404);
    }

    if (!createAttendanceDto.gps_lat || !createAttendanceDto.gps_lng) {
      return this.response.fail(
        "GPS latitude and longitude are required to take attendance",
        400,
      );
    }

    const currentLatitude = +createAttendanceDto.gps_lat;
    const currentLongitude = +createAttendanceDto.gps_lng;
    const settingLatitude = +attendanceSetting.gps_lat;
    const settingLongitude = +attendanceSetting.gps_lng;

    if (
      [
        currentLatitude,
        currentLongitude,
        settingLatitude,
        settingLongitude,
      ].some(Number.isNaN)
    ) {
      return this.response.fail("Invalid GPS coordinate format", 400);
    }

    const distanceMeters = this.calculateDistanceMeters(
      settingLatitude,
      settingLongitude,
      currentLatitude,
      currentLongitude,
    );
    if (distanceMeters > attendanceSetting.radius_meter) {
      const roundedDistance = Math.ceil(distanceMeters);
      return this.response.fail(
        `You are ${roundedDistance} meter away from attendance location, can't take attendance`,
        400,
      );
    }

    const clockIn = this.getNowInAttendanceTimeZone();
    const lateDuration = this.calculateLateDuration(
      clockIn,
      attendanceSetting.check_in_time,
    );
    const noteWordCount = this.countWords(createAttendanceDto.note || "");
    const minimumRequiredWords =
      lateDuration * this.lateNoteRequiredWordsPerMinute;
    const additionalWordsNeeded =
      lateDuration > 0 ? Math.max(minimumRequiredWords - noteWordCount, 0) : 0;

    const transaction = await this.sequelize.transaction();
    try {
      const attendance = await this.attendanceModel.create(
        {
          ...createAttendanceDto,
          clock_in: clockIn,
          is_late: lateDuration > 0,
          late_duration: lateDuration,
          attendance_setting_id: attendanceSetting.id,
          user_id: user.id,
          created_by: user.id,
        },
        { transaction },
      );

      await transaction.commit();
      return this.response.success(
        {
          attendance,
          late_note_requirement: {
            is_required: lateDuration > 0,
            required_words: minimumRequiredWords,
            current_words: noteWordCount,
            additional_words_needed: additionalWordsNeeded,
            is_fulfilled: additionalWordsNeeded === 0,
          },
        },
        201,
        additionalWordsNeeded > 0
          ? `Attendance recorded. You are late ${lateDuration} minute(s), add ${additionalWordsNeeded} words more`
          : "Successfully create attendance",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error.message || error, 400);
    }
  }

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
      return this.response.fail(error.message || error, 400);
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
      return this.response.fail(error.message || error, 400);
    }
  }

  async updateLateNote(
    attendance: Attendance,
    user: User,
    updateLateNoteDto: UpdateLateNoteDto,
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

    const requiredWords =
      attendance.late_duration * this.lateNoteRequiredWordsPerMinute;
    const currentWords = this.countWords(updateLateNoteDto.note || "");
    const additionalWordsNeeded = Math.max(requiredWords - currentWords, 0);

    if (additionalWordsNeeded > 0) {
      return this.response.fail(
        `You are late ${attendance.late_duration} minute(s), add ${additionalWordsNeeded} words more`,
        400,
      );
    }

    const transaction = await this.sequelize.transaction();
    try {
      await attendance.update(
        {
          note: updateLateNoteDto.note,
        },
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
      return this.response.fail(error.message || error, 400);
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
      return this.response.fail(error.message || error, 400);
    }
  }
}
