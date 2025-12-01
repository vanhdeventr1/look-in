import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { CurrentUser } from "src/cores/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { JoiValidationParamPipe } from "src/cores/validators/pipes/joi-validation-param.pipe";
import { JoiValidationPipe } from "src/cores/validators/pipes/joi-validation.pipe";
import { User } from "../user/entities/user.entity";
//import { CreatePermitImageDto } from "src/features/permit-image/dto/create-permit-image.dto";
import { CreatePermitDto } from "./dto/create-permit.dto";
import { UpdatePermitDto } from "./dto/update-permit.dto";
import { Permit } from "./entities/permit.entity";
import { PermitService } from "./permit.service";
import { permitIdParamSchema } from "./validations/params/permit-id.param";
import { createPermitSchema } from "./validations/requests/create-permit.request";
import { updatePermitSchema } from "./validations/requests/update-permit.request";

@Controller()
export class PermitController {
  constructor(
    private readonly permitService: PermitService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  create(
    @CurrentUser() user: User,
    @Body(new JoiValidationPipe(createPermitSchema))
    createPermitDto: CreatePermitDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    return this.permitService.create(
      createPermitDto,
      user,
      files,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser() user: User, @Query() query) {
    return this.permitService.findAll(user, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id", new JoiValidationParamPipe(permitIdParamSchema))
    permit: Permit,
  ) {
    return this.permitService.findOne(permit);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(
    @CurrentUser() user: User,
    @Param("id", new JoiValidationParamPipe(permitIdParamSchema))
    permit: Permit,
    @Body(new JoiValidationPipe(updatePermitSchema))
    updatePermitDto: UpdatePermitDto,
  ) {
    return this.permitService.update(
      permit,
      updatePermitDto,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @Param("id", new JoiValidationParamPipe(permitIdParamSchema))
    permit: Permit,
  ) {
    return this.permitService.remove(permit);
  }
}
