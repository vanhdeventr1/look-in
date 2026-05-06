import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { SharpHelper } from "src/cores/helpers/sharp.helper";
import { User } from "src/features/user/entities/user.entity";
import UserRoleEnum from "../user/enums/user-role.enum";
import { CreateDatasetDto } from "./dto/create-dataset.dto";
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
      const s3Urls = []; // ✅ collect S3 URLs
      const sharpHelper = new SharpHelper();

      for (const file of files) {
        const uploadFile = await sharpHelper.resizeAndUpload(file, {
          path: Dataset.imageOption.path,
        });

        const image = new URL(uploadFile.url);

        imageData.push({
          file_path: image.pathname.substring(1),
        });

        s3Urls.push(uploadFile.url); // ✅ save public S3 URL
      }

      // ✅ get target user name for AI model folder
      const targetUser = await this.userModel.findByPk(
        createDatasetDto.user_id,
        { attributes: ["id", "name"] },
      );

      if (!targetUser) {
        await transaction.rollback();
        return this.response.fail("User not found", 404);
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

      // ✅ trigger AI service to retrain
      try {
        await fetch("http://localhost:8000/train", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            person_name: targetUser.name,
            s3_urls: s3Urls,
          }),
        });
        console.log(`[AI] Retrained model for ${targetUser.name}`);
      } catch (aiError: any) {
        console.warn("[AI] Train trigger failed:", aiError.message);
      }

      return this.response.success(
        {
          id: dataset.id,
          user_id: dataset.user_id,
          created_by: dataset.created_by,
          created_at: dataset.createdAt,
          image_count: imageData.length,
        },
        201,
        "Successfully created dataset",
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
        .load("user", "dataset_images")
        .setSubQuery(false)
        .getResult();

      if (!result) {
        return this.response.success(
          { count: 0, datasets: [] },
          200,
          "No datasets found",
        );
      }

      const { count, data } = result;

      const cleaned = data.map((d: any) => ({
        id: d.id,
        user: d.user
          ? {
              id: d.user.id,
              name: d.user.name,
            }
          : null,
        image_count: d.dataset_images ? d.dataset_images.length : 0,
        created_at: d.created_at,
      }));

      return this.response.success(
        { count, datasets: cleaned },
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
            attributes: ["id", "name"],
          },
          {
            association: "created_by_user",
            attributes: ["id", "name"],
          },
        ],
      });

      const result = {
        id: dataset.id,
        user: dataset.user
          ? {
              id: dataset.user.id,
              name: dataset.user.name,
            }
          : null,
        created_by_user: dataset.created_by_user
          ? {
              id: dataset.created_by_user.id,
              name: dataset.created_by_user.name,
            }
          : null,
        image_count: dataset.dataset_images ? dataset.dataset_images.length : 0,
        created_at: dataset.createdAt,
        updated_at: dataset.updatedAt,
      };

      return this.response.success(result, 200, "Successfully get dataset");
    } catch (error) {
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
