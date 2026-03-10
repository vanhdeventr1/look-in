import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { AttendanceSetting } from "../attendance-setting/entities/attendance-setting.entity";
import { User } from "../user/entities/user.entity";
import UserRoleEnum from "../user/enums/user-role.enum";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { Attendance } from "./entities/attendance.entity";

@Injectable()
export class AttendanceService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(Attendance)
    private readonly attendanceModel: typeof Attendance,
    @InjectModel(AttendanceSetting)
    private readonly attendanceSettingModel: typeof AttendanceSetting,
  ) {}

  private parseTimeOnDate(date: Date, time: string): Date {
    const [hour, minute, second] = time.split(":").map((value) => +value || 0);
    const result = new Date(date);
    result.setHours(hour, minute, second, 0);
    return result;
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
      [currentLatitude, currentLongitude, settingLatitude, settingLongitude].some(
        Number.isNaN,
      )
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

    const clockIn = createAttendanceDto.clock_in
      ? new Date(createAttendanceDto.clock_in)
      : new Date();
    const lateDuration = this.calculateLateDuration(
      clockIn,
      attendanceSetting.check_in_time,
    );

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
      return this.response.success(attendance, 201, "Successfully create attendance");
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
        include: ["user", "created_by_user", "attendance_images", "attendance_setting", "permit"],
      });

      return this.response.success(attendance, 200, "Successfully get attendance");
    } catch (error) {
      return this.response.fail(error.message || error, 400);
    }
  }

  async update(attendance: Attendance, updateAttendanceDto: UpdateAttendanceDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await attendance.update(updateAttendanceDto, { transaction });
      await transaction.commit();

      return this.response.success(attendance, 200, "Successfully update attendance");
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
