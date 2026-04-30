import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/cores/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { JoiValidationParamPipe } from "src/cores/validators/pipes/joi-validation-param.pipe";
import { JoiValidationPipe } from "src/cores/validators/pipes/joi-validation.pipe";
import { User } from "../user/entities/user.entity";
import { AttendanceService } from "./attendance.service";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { Attendance } from "./entities/attendance.entity";
import { attendanceIdParamSchema } from "./validations/params/attendance-id.param";
import { updateAttendanceSchema } from "./validations/requests/update-attendance-id.request";

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(JwtAuthGuard)
  @Post("check-in")
  checkIn(
    @CurrentUser() user: User,
    @Query("gps_lat") gps_lat: string,
    @Query("gps_lng") gps_lng: string,
    @Query("note") note?: string,
  ) {
    return this.attendanceService.checkIn(user, { gps_lat, gps_lng, note });
  }

  @UseGuards(JwtAuthGuard)
  @Post("check-out")
  checkOut(
    @CurrentUser() user: User,
    @Query("gps_lat") gps_lat: string,
    @Query("gps_lng") gps_lng: string,
    @Query("note") note?: string,
  ) {
    return this.attendanceService.checkOut(user, { gps_lat, gps_lng, note });
  }

  @UseGuards(JwtAuthGuard)
  @Get("today")
  today(@CurrentUser() user: User) {
    return this.attendanceService.today(user);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // create(
  //   @CurrentUser() user: User,
  //   @Body(new JoiValidationPipe(createAttendanceSchema))
  //   createAttendanceDto: CreateAttendanceDto,
  // ) {
  //   return this.attendanceService.create(createAttendanceDto, user);
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query) {
    return this.attendanceService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(
    @Param("id", new JoiValidationParamPipe(attendanceIdParamSchema))
    attendance: Attendance,
  ) {
    return this.attendanceService.findOne(attendance);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/late-note")
  updateLateNote(
    @CurrentUser() user: User,
    @Param("id", new JoiValidationParamPipe(attendanceIdParamSchema))
    attendance: Attendance,
    @Body(new JoiValidationPipe(updateAttendanceSchema))
    updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.updateLateNote(
      attendance,
      user,
      updateAttendanceDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @Param("id", new JoiValidationParamPipe(attendanceIdParamSchema))
    attendance: Attendance,
  ) {
    return this.attendanceService.remove(attendance);
  }
}
