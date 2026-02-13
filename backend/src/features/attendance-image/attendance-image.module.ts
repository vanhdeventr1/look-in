import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AttendanceImageController } from "./attendance-image.controller";
import { AttendanceImageService } from "./attendance-image.service";
import { AttendanceImage } from "./entities/attendance-image.entity";

@Module({
  imports: [SequelizeModule.forFeature([AttendanceImage])],
  controllers: [AttendanceImageController],
  providers: [AttendanceImageService],
})
export class AttendanceImageModule {}
