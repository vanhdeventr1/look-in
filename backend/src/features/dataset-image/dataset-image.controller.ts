import {
  Body,
  Controller,
  Delete,
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
import { Dataset } from "../dataset/entities/dataset.entity";
import { datasetIdParamSchema } from "../dataset/validations/params/dataset-id.param";
import { DatasetImageService } from "./dataset-image.service";
import { CreateDatasetImageDto } from "./dto/create-dataset-image.dto";
import { DatasetImage } from "./entities/dataset-image.entity";
import { datasetImageIdParamSchema } from "./validations/params/dataset-image-id.param";
import { createDatasetImageSchema } from "./validations/requests/create-dataset-image.request";

@Controller()
export class DatasetImageController {
  constructor(private readonly datasetImageService: DatasetImageService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Param("datasetId", new JoiValidationParamPipe(datasetIdParamSchema))
    dataset: Dataset,
    @Body(new JoiValidationPipe(createDatasetImageSchema))
    createDatasetImageDto: CreateDatasetImageDto,
    @UploadedFiles()
    file: Array<Express.Multer.File>,
  ) {
    return this.datasetImageService.create(
      dataset,
      createDatasetImageDto,
      file,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param("datasetId", new JoiValidationParamPipe(datasetIdParamSchema))
    dataset: Dataset,
    @Query() query,
  ) {
    return this.datasetImageService.findAll(dataset, query);
  }

  // @UseGuards(JwtAuthGuard)
  // @Put(":id")
  // async update(
  //   @Param(new JoiValidationParamPipe(datasetImageIdParamSchema))
  //   datasetImage: DatasetImage,
  //   @Body(new JoiValidationPipe(updateDatasetImageSchema))
  //   updateDatasetImageDto: UpdateDatasetImageDto,
  // ) {
  //   return this.datasetImageService.update(datasetImage, updateDatasetImageDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @Param(new JoiValidationParamPipe(datasetImageIdParamSchema))
    datasetImage: DatasetImage,
  ) {
    return this.datasetImageService.remove(datasetImage);
  }
}
