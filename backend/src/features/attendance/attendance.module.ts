import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AttendanceSetting } from "../attendance-setting/entities/attendance-setting.entity";
import { AttendanceImage } from "../attendance-image/entities/attendance-image.entity";
import { Permit } from "../permit/entities/permit.entity";
import { User } from "../user/entities/user.entity";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";
import { Attendance } from "./entities/attendance.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Attendance,
      AttendanceImage,
      AttendanceSetting,
      Permit,
      User,
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
