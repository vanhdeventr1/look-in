import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { User } from "../user/entities/user.entity";
import UserRoleEnum from "../user/enums/user-role.enum";
import { CreateAttendanceSettingDto } from "./dto/create-attendance-setting.dto";
import { UpdateAttendanceSettingDto } from "./dto/update-attendance-setting.dto";
import { AttendanceSetting } from "./entities/attendance-setting.entity";

@Injectable()
export class AttendanceSettingService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(AttendanceSetting)
    private readonly attendanceSettingModel: typeof AttendanceSetting,
  ) {}

  async create(
    createAttendanceSettingDto: CreateAttendanceSettingDto,
    user: User,
  ) {
    if (user.role !== UserRoleEnum.HIRING_MANAGER) {
      return this.response.fail(
        "Only hiring manager can create attendance setting",
        403,
      );
    }

    const transaction = await this.sequelize.transaction();
    try {
      const attendanceSetting = await this.attendanceSettingModel.create(
        {
          ...createAttendanceSettingDto,
        },
        { transaction },
      );

      await transaction.commit();
      return this.response.success(
        attendanceSetting,
        201,
        "Successfully create attendance setting",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async findAll() {
    try {
      const attendanceSettings = await this.attendanceSettingModel.findAll({
        order: [["id", "DESC"]],
      });
      return this.response.success(
        attendanceSettings,
        200,
        "Successfully get attendance settings",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(attendanceSetting: AttendanceSetting) {
    try {
      return this.response.success(
        attendanceSetting,
        200,
        "Successfully get attendance setting",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async update(
    attendanceSetting: AttendanceSetting,
    updateAttendanceSettingDto: UpdateAttendanceSettingDto,
    user: User,
  ) {
    if (user.role !== UserRoleEnum.HIRING_MANAGER) {
      return this.response.fail(
        "Only hiring manager can update attendance setting",
        403,
      );
    }

    const transaction = await this.sequelize.transaction();
    try {
      await attendanceSetting.update(updateAttendanceSettingDto, {
        transaction,
      });

      await transaction.commit();
      return this.response.success(
        attendanceSetting,
        200,
        "Successfully update attendance setting",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(attendanceSetting: AttendanceSetting, user: User) {
    if (user.role !== UserRoleEnum.HIRING_MANAGER) {
      return this.response.fail(
        "Only hiring manager can delete attendance setting",
        403,
      );
    }

    const transaction = await this.sequelize.transaction();
    try {
      await attendanceSetting.destroy({ transaction });
      await transaction.commit();

      return this.response.success(
        {},
        200,
        "Successfully delete attendance setting",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
