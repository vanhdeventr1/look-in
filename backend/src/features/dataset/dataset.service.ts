import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { SharpHelper } from "src/cores/helpers/sharp.helper";
import { User } from "src/features/user/entities/user.entity";
import UserRoleEnum from "../user/enums/user-role.enum";
import { CreateDatasetDto } from "./dto/create-dataset.dto";
import { UpdateDatasetDto } from "./dto/update-dataset.dto";
import { Dataset } from "./entities/dataset.entity";

@Injectable()
export class DatasetService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(Dataset)
    private readonly datasetModel: typeof Dataset,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(
    createDatasetDto: CreateDatasetDto,
    user: User,
    files: Array<Express.Multer.File>,
  ) {
    // 1. Authorization Check
    if (user.role !== UserRoleEnum.HIRING_MANAGER) {
      return this.response.fail("Only hiring manager can create dataset", 403);
    }
    if (!files || files.length === 0) {
      return this.response.fail("Image is required", 400);
    }

    const transaction = await this.sequelize.transaction();
    try {
      const imageData = [];
      const sharpHelper = new SharpHelper();

      // 2. Process and Upload Images
      for (const file of files) {
        const uploadFile = await sharpHelper.resizeAndUpload(
          file,
          Dataset.imageDimension.datasetImage,
        );
        const image = new URL(uploadFile.url);
        imageData.push({
          url: image.href,
          file_path: image.pathname.substring(1),
        });
      }

      // 3. Create Dataset with nested images
      const dataset = await this.datasetModel.create(
        {
          user_id: createDatasetDto.user_id, // The target employee
          created_by: user.id, // The hiring manager
          dataset_images: imageData,
        },
        {
          transaction,
          include: ["dataset_images"],
        },
      );

      await transaction.commit();

      // 4. Reload with proper associations defined in Entity
      await dataset.reload({
        include: [
          { association: "user", attributes: { exclude: ["password"] } },
          "dataset_images",
        ],
      });

      return this.response.success(
        dataset,
        201,
        "Successfully created dataset for employee",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(
        error.message || "An error occurred during creation",
        400,
      );
    }
  }

  async findAll(user: User, query: any) {
    if (user.role !== UserRoleEnum.HIRING_MANAGER) {
      return this.response.fail("Only hiring manager can see dataset", 403);
    }

    try {
      // Change userModel to datasetModel
      const result = await new QueryBuilderHelper(
        this.datasetModel, // Query the datasets directly
        query,
      )
        .load("dataset_images") // Load the images
        .load("user") // Load the employee info
        .getResult();

      if (!result) {
        return this.response.success(
          { count: 0, datasets: [] },
          200,
          "No datasets found",
        );
      }

      const { count, data } = result;

      return this.response.success(
        { count, datasets: data },
        200,
        "Successfully retrieved datasets",
      );
    } catch (error) {
      return this.response.fail(error.message, 400);
    }
  }

  async findOne(dataset: Dataset) {
    try {
      await dataset.reload({
        include: [
          { association: "dataset_images" },
          {
            association: "user", // The employee
            attributes: { exclude: ["password"] },
          },
          {
            association: "created_by_user", // The manager
            attributes: { exclude: ["password"] },
          },
        ],
      });

      return this.response.success(dataset, 200, "Successfully get dataset");
    } catch (error) {
      return this.response.fail(error.message || error, 400);
    }
  }

  async update(
    dataset: Dataset,
    updateDatasetDto: UpdateDatasetDto,
    user: User,
  ) {
    if (user.role !== UserRoleEnum.HIRING_MANAGER) {
      return this.response.fail("Only hiring manager can update dataset", 403);
    }

    const transaction = await this.sequelize.transaction();
    try {
      await dataset.update(updateDatasetDto, { transaction });
      await transaction.commit();

      return this.response.success(dataset, 200, "Successfully update dataset");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error.message || error, 400);
    }
  }

  async remove(dataset: Dataset, user: User) {
    if (user.role !== UserRoleEnum.HIRING_MANAGER) {
      return this.response.fail("Only hiring manager can delete dataset", 403);
    }

    const transaction = await this.sequelize.transaction();
    try {
      await dataset.destroy({ transaction });
      await transaction.commit();

      return this.response.success({}, 200, "Successfully delete dataset");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error.message || error, 400);
    }
  }
}
