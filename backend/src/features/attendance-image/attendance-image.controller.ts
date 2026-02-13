import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { JoiValidationParamPipe } from "src/cores/validators/pipes/joi-validation-param.pipe";
import { JoiValidationPipe } from "src/cores/validators/pipes/joi-validation.pipe";
import { Attendance } from "../attendance/entities/attendance.entity";
import { attendanceIdParamSchema } from "../attendance/validations/params/attendance-id.param";
import { AttendanceImageService } from "./attendance-image.service";
import { CreateAttendanceImageDto } from "./dto/create-attendance-image.dto";
import { createAttendanceImageSchema } from "./validations/requests/create-attendance-image.request";

@Controller()
export class AttendanceImageController {
  constructor(
    private readonly attendanceImageService: AttendanceImageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Param("attendanceId", new JoiValidationParamPipe(attendanceIdParamSchema))
    attendance: Attendance,
    @Body(new JoiValidationPipe(createAttendanceImageSchema))
    createAttendanceImageDto: CreateAttendanceImageDto,
    @UploadedFiles()
    file: Array<Express.Multer.File>,
  ) {
    return this.attendanceImageService.create(
      attendance,
      createAttendanceImageDto,
      file,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param("attendanceId", new JoiValidationParamPipe(attendanceIdParamSchema))
    attendance: Attendance,
    @Query() query,
  ) {
    return this.attendanceImageService.findAll(attendance, query);
  }
}
