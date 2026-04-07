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

      for (const file of files) {
        // ← changed: no more resizing, just upload original
        const uploadFile = await sharpHelper.resizeAndUpload(file, {
          path: Dataset.imageOption.path,
        });
        const image = new URL(uploadFile.url);
        imageData.push({
          url: image.href,
          file_path: image.pathname.substring(1),
        });
      }

      const dataset = await this.datasetModel.create(
        {
          user_id: createDatasetDto.user_id,
          created_by: user.id,
          dataset_images: imageData,
        },
        {
          transaction,
          include: ["dataset_images"],
        },
      );

      await transaction.commit();

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
      return this.response.fail(error, 400);
    }
  }

  async findAll(user: User, query: any) {
    if (user.role !== UserRoleEnum.HIRING_MANAGER) {
      return this.response.fail("Only hiring manager can see dataset", 403);
    }

    try {
      const result = await new QueryBuilderHelper(this.datasetModel, query)
        .load("dataset_images")
        .load("user")
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
      return this.response.fail(error, 400);
    }
  }

  async findOne(dataset: Dataset) {
    try {
      await dataset.reload({
        include: [
          { association: "dataset_images" },
          {
            association: "user",
            attributes: { exclude: ["password"] },
          },
          {
            association: "created_by_user",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      return this.response.success(dataset, 200, "Successfully get dataset");
    } catch (error) {
      return this.response.fail(error, 400);
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
      return this.response.fail(error, 400);
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
      return this.response.fail(error, 400);
    }
  }
}
