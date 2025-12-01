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
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { JoiValidationParamPipe } from "src/cores/validators/pipes/joi-validation-param.pipe";
import { JoiValidationPipe } from "src/cores/validators/pipes/joi-validation.pipe";
import { Permit } from "../permit/entities/permit.entity";
import { permitIdParamSchema } from "../permit/validations/params/permit-id.param";
import { CreatePermitImageDto } from './dto/create-permit-image.dto';
import { UpdatePermitImageDto } from './dto/update-permit-image.dto';
import { PermitImage } from './entities/permit-image.entity';
import { PermitImageService } from './permit-image.service';
import { permitImageIdParamSchema } from "./validations/params/permit-image-id.param";
import { createPermitImageSchema } from "./validations/requests/create-permit-image.request";
import { updatePermitImageSchema } from "./validations/requests/update-permit-image.request";

@Controller()
export class PermitImageController {
  constructor(
    private readonly permitImageService: PermitImageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Param(
      "permitId",
      new JoiValidationParamPipe(permitIdParamSchema),
    )
    permit: Permit,
    @Body(new JoiValidationPipe(createPermitImageSchema))
    createPermitImageDto: CreatePermitImageDto,
    @UploadedFiles()
    file: Array<Express.Multer.File>,
  ) {
    return this.permitImageService.create(
      permit,
      createPermitImageDto,
      file,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param(
      "permitId",
      new JoiValidationParamPipe(permitIdParamSchema),
    )
    permit: Permit,
    @Query() query,
  ) {
    return this.permitImageService.findAll(
      permit,
      query,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param(new JoiValidationParamPipe(permitImageIdParamSchema))
    permitImage: PermitImage,
    @Body(new JoiValidationPipe(updatePermitImageSchema))
    updatePermitImageDto: UpdatePermitImageDto,
  ) {
    return this.permitImageService.update(
      permitImage,
      updatePermitImageDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @Param(new JoiValidationParamPipe(permitImageIdParamSchema))
    permitImage: PermitImage,
  ) {
    return this.permitImageService.remove(permitImage);
  }
}
