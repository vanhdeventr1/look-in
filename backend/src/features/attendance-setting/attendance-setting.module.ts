import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AttendanceSettingController } from "./attendance-setting.controller";
import { AttendanceSettingService } from "./attendance-setting.service";
import { AttendanceSetting } from "./entities/attendance-setting.entity";

@Module({
  imports: [SequelizeModule.forFeature([AttendanceSetting])],
  controllers: [AttendanceSettingController],
  providers: [AttendanceSettingService],
})
export class AttendanceSettingModule {}
