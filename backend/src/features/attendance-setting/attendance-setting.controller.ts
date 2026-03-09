import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/cores/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { JoiValidationParamPipe } from "src/cores/validators/pipes/joi-validation-param.pipe";
import { JoiValidationPipe } from "src/cores/validators/pipes/joi-validation.pipe";
import { User } from "../user/entities/user.entity";
import { AttendanceSettingService } from "./attendance-setting.service";
import { CreateAttendanceSettingDto } from "./dto/create-attendance-setting.dto";
import { UpdateAttendanceSettingDto } from "./dto/update-attendance-setting.dto";
import { AttendanceSetting } from "./entities/attendance-setting.entity";
import { attendanceSettingIdParamSchema } from "./validations/params/attendance-setting-id.param";
import { createAttendanceSettingSchema } from "./validations/requests/create-attendance-setting-id.request";
import { updateAttendanceSettingSchema } from "./validations/requests/update-attendance-setting-id.request";

@Controller()
export class AttendanceSettingController {
  constructor(
    private readonly attendanceSettingService: AttendanceSettingService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: User,
    @Body(new JoiValidationPipe(createAttendanceSettingSchema))
    createAttendanceSettingDto: CreateAttendanceSettingDto,
  ) {
    return this.attendanceSettingService.create(
      createAttendanceSettingDto,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.attendanceSettingService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(
    @Param("id", new JoiValidationParamPipe(attendanceSettingIdParamSchema))
    attendanceSetting: AttendanceSetting,
  ) {
    return this.attendanceSettingService.findOne(attendanceSetting);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  @Patch(":id")
  update(
    @CurrentUser() user: User,
    @Param("id", new JoiValidationParamPipe(attendanceSettingIdParamSchema))
    attendanceSetting: AttendanceSetting,
    @Body(new JoiValidationPipe(updateAttendanceSettingSchema))
    updateAttendanceSettingDto: UpdateAttendanceSettingDto,
  ) {
    return this.attendanceSettingService.update(
      attendanceSetting,
      updateAttendanceSettingDto,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @CurrentUser() user: User,
    @Param("id", new JoiValidationParamPipe(attendanceSettingIdParamSchema))
    attendanceSetting: AttendanceSetting,
  ) {
    return this.attendanceSettingService.remove(attendanceSetting, user);
  }
}
