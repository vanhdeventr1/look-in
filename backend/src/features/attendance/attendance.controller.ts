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
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateLateNoteDto } from "./dto/update-late-note.dto";
import { Attendance } from "./entities/attendance.entity";
import { attendanceIdParamSchema } from "./validations/params/attendance-id.param";
import { createAttendanceSchema } from "./validations/requests/create-attendance-id.request";
import { updateLateNoteSchema } from "./validations/requests/update-late-note.request";

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: User,
    @Body(new JoiValidationPipe(createAttendanceSchema))
    createAttendanceDto: CreateAttendanceDto,
  ) {
    return this.attendanceService.create(createAttendanceDto, user);
  }

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
    @Body(new JoiValidationPipe(updateLateNoteSchema))
    updateLateNoteDto: UpdateLateNoteDto,
  ) {
    return this.attendanceService.updateLateNote(
      attendance,
      user,
      updateLateNoteDto,
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
