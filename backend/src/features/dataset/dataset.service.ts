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

async create(createDatasetDto: CreateDatasetDto, user: User, files: Array<Express.Multer.File>) {
  if (user.role !== UserRoleEnum.HIRING_MANAGER) {
    return this.response.fail("Only hiring manager can create dataset", 403);
  }

  const transaction = await this.sequelize.transaction();
  try {
    const data = [];
    const sharpHelper = new SharpHelper();

    for (const file of files) {
      const uploadFile = await sharpHelper.resizeAndUpload(file, Dataset.imageDimension.datasetImage);
      const image = new URL(uploadFile.url);
      data.push({
        url: image.href,
        file_path: image.pathname.substring(1),
      });
    }

    const dataset = await this.datasetModel.create(
      {
        name: createDatasetDto.name, // This is the ID of the employee selected from your table
        created_by: user.id,         // This is the ID of the HR performing the action
        dataset_images: data,
      },
      {
        transaction,
        include: ["dataset_images"],
      },
    );

    await transaction.commit();
    await dataset.reload({ include: ["name_user"] });

    return this.response.success(dataset, 201, "Successfully created dataset for employee");
  } catch (error) {
    await transaction.rollback();
    return this.response.fail(error.message || error, 400);
  }
}

// src/features/dataset/dataset.service.ts

async findAllUsersByHR(user: User, query: any) {
  try {
    // 1. Log the user ID to your terminal to verify who is logged in
    console.log("Logged in HR ID:", user.id);

    const { count, data } = await new QueryBuilderHelper(this.userModel, query)
      // .where({ created_by: user.id }) <--- Temporarily comment this out to test
      .load("datasets")
      .getResult();

    const formattedData = data.map((employee: any) => {
      const plainUser = employee.get({ plain: true });
      return {
        ...plainUser,
        has_dataset: !!(plainUser.datasets && plainUser.datasets.length > 0)
      };
    });

    return this.response.success(
      { count, employees: formattedData },
      200,
      "Successfully retrieved employees",
    );
  } catch (error) {
    return this.response.fail(error.message, 400);
  }
}

  async findOne(dataset: Dataset) {
    try {
      await dataset.reload({
        include: [
          { association: "dataset_images"},
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

  async update(dataset: Dataset, updateDatasetDto: UpdateDatasetDto, user: User) {
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
