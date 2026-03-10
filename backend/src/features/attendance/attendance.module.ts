import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AttendanceSetting } from "../attendance-setting/entities/attendance-setting.entity";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";
import { Attendance } from "./entities/attendance.entity";

@Module({
  imports: [SequelizeModule.forFeature([Attendance, AttendanceSetting])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
