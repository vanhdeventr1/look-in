import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { Attendance } from "./entities/attendance.entity";
import { attendanceIdParamSchema } from "./validations/params/attendance-id.param";
import { createAttendanceSchema } from "./validations/requests/create-attendance-id.request";
import { updateAttendanceSchema } from "./validations/requests/update-attendance-id.request";

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
  @Put(":id")
  @Patch(":id")
  update(
    @Param("id", new JoiValidationParamPipe(attendanceIdParamSchema))
    attendance: Attendance,
    @Body(new JoiValidationPipe(updateAttendanceSchema))
    updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(attendance, updateAttendanceDto);
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
