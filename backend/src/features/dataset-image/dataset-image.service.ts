import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { SharpHelper } from "src/cores/helpers/sharp.helper";
import { Dataset } from "../dataset/entities/dataset.entity";
import { CreateDatasetImageDto } from "./dto/create-dataset-image.dto";
import { UpdateDatasetImageDto } from "./dto/update-dataset-image.dto";
import { DatasetImage } from "./entities/dataset-image.entity";

@Injectable()
export class DatasetImageService {
  constructor(
    private response: ResponseHelper,
    private sequelize: Sequelize,
    @InjectModel(DatasetImage)
    private datasetImageModel: typeof DatasetImage,
  ) {}

  async create(
    dataset: Dataset,
    createDatasetImageDto: CreateDatasetImageDto,
    files: Array<Express.Multer.File>,
  ) {
    if (!files.length) {
      return this.response.fail("Image is required", 400);
    }

    const transaction = await this.sequelize.transaction();
    try {
      const sharpHelper = new SharpHelper();

      for (const [
        index,
        datasetImage,
      ] of createDatasetImageDto.dataset_images.entries()) {
        if (!files[index]) {
          return this.response.fail(`Image at index ${index} is required`, 400);
        }

        // ← changed: upload original only, no resizing
        const uploadResult = await sharpHelper.resizeAndUpload(files[index], {
          path: Dataset.imageOption.path,
        });

        const imageUrl = new URL(uploadResult.url);
        datasetImage.file_path = imageUrl.pathname.substring(1);
        datasetImage.url = imageUrl.href;
        datasetImage.dataset_id = dataset.id;
      }

      const datasetImages = await this.datasetImageModel.bulkCreate(
        createDatasetImageDto.dataset_images,
        { transaction },
      );

      await transaction.commit();
      return this.response.success(
        datasetImages,
        201,
        "Successfully create dataset image",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async findAll(dataset: Dataset, query: any) {
    const { count, data } = await new QueryBuilderHelper(
      this.datasetImageModel,
      query,
    )
      .where({ dataset_id: dataset.id })
      .getResult();

    return this.response.success(
      { count, dataset_images: data },
      200,
      "Successfully get dataset images",
    );
  }

  async update(
    datasetImage: DatasetImage,
    updateDatasetImageDto: UpdateDatasetImageDto,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      await datasetImage.update(updateDatasetImageDto, { transaction });
      await transaction.commit();

      return this.response.success(
        datasetImage,
        200,
        "Successfully update dataset image",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(datasetImage: DatasetImage) {
    const transaction = await this.sequelize.transaction();
    try {
      // ← changed: no dimension needed anymore
      if (datasetImage.file_path) {
        const sharpHelper = new SharpHelper();
        await sharpHelper.delete(datasetImage.file_path);
      }

      await datasetImage.destroy({ transaction });
      await transaction.commit();

      return this.response.success(
        {},
        200,
        "Successfully delete dataset image",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail("Failed delete dataset image", 400);
    }
  }
}
