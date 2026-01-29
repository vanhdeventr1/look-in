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
import { DatasetService } from "src/features/dataset/dataset.service";
import { CreateDatasetDto } from "src/features/dataset/dto/create-dataset.dto";
import { UpdateDatasetDto } from "src/features/dataset/dto/update-dataset.dto";
import { Dataset } from "src/features/dataset/entities/dataset.entity";
import { datasetIdParamSchema } from "src/features/dataset/validations/params/dataset-id.param";
import { createDatasetSchema } from "src/features/dataset/validations/request/create-dataset.request";
import { User } from "../user/entities/user.entity";

@Controller()
export class DatasetController {
  constructor(private readonly datasetService: DatasetService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  create(
    @CurrentUser() user: User,
    @Body(new JoiValidationPipe(createDatasetSchema))
    createDatasetDto: CreateDatasetDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    return this.datasetService.create(createDatasetDto, user, files);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser() user: User, @Query() query) {
    return this.datasetService.findAll(user, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id", new JoiValidationParamPipe(datasetIdParamSchema))
    dataset: Dataset,
  ) {
    return this.datasetService.findOne(dataset);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(
    @CurrentUser() user: User,
    @Param("id", new JoiValidationParamPipe(datasetIdParamSchema))
    dataset: Dataset,
    @Body(new JoiValidationPipe(createDatasetSchema))
    updateDatasetDto: UpdateDatasetDto,
  ) {
    return this.datasetService.update(dataset, updateDatasetDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @CurrentUser() user: User,
    @Param("id", new JoiValidationParamPipe(datasetIdParamSchema))
    dataset: Dataset,
  ) {
    return this.datasetService.remove(dataset, user);
  }
}
