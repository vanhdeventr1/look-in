import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { EncryptionHelper } from "src/cores/helpers/encryption.helper"; // ✅
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { SharpHelper } from "src/cores/helpers/sharp.helper";
import { DatasetImage } from "src/features/dataset-image/entities/dataset-image.entity";
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
    @InjectModel(DatasetImage)
    private readonly datasetImageModel: typeof DatasetImage,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  private getAiUrl() {
    return process.env.AI_SERVICE_URL || "http://localhost:8000";
  }

  private getAiHeaders(extraHeaders: Record<string, string> = {}) {
    const apiKey = process.env.AI_SERVICE_API_KEY;
    return {
      ...extraHeaders,
      ...(apiKey ? { "X-AI-API-Key": apiKey } : {}),
    };
  }

  private async deleteAiDataset(personName: string) {
    const response = await fetch(
      `${this.getAiUrl()}/dataset/${encodeURIComponent(personName)}`,
      { method: "DELETE", headers: this.getAiHeaders() },
    );

    if (!response.ok && response.status !== 404) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.error || "Failed to delete AI dataset");
    }
  }

  private async deleteAllAiDatasets() {
    const response = await fetch(`${this.getAiUrl()}/dataset`, {
      method: "DELETE",
      headers: this.getAiHeaders(),
    });

    if (!response.ok && response.status !== 404) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.error || "Failed to delete all AI datasets");
    }
  }

  private async trainAiDataset(personName: string, s3Urls: string[]) {
    await this.deleteAiDataset(personName).catch((error) => {
      console.warn("[AI] Existing dataset cleanup skipped:", error.message);
    });

    const response = await fetch(`${this.getAiUrl()}/train`, {
      method: "POST",
      headers: this.getAiHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        person_name: personName,
        s3_urls: s3Urls,
      }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.error || "Failed to train AI dataset");
    }
  }

  private deleteAiDatasetInBackground(personName: string) {
    void this.deleteAiDataset(personName)
      .then(() => {
        console.log(`[AI] Deleted dataset for ${personName}`);
      })
      .catch((aiError: any) => {
        console.warn("[AI] Delete dataset failed:", aiError.message);
      });
  }

  private async deleteStoredDatasetImages(filePaths: string[]) {
    const sharpHelper = new SharpHelper();

    await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          await sharpHelper.delete(filePath);
        } catch (error: any) {
          console.warn(
            `[Dataset] Failed to delete stored image ${filePath}:`,
            error?.message || error,
          );
        }
      }),
    );
  }

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
      const s3Urls = [];
      const sharpHelper = new SharpHelper();

      for (const file of files) {
        const uploadFile = await sharpHelper.resizeAndUpload(file, {
          path: Dataset.imageOption.path,
        });

        const image = new URL(uploadFile.url);

        imageData.push({
          file_path: EncryptionHelper.encrypt(image.pathname.substring(1)),
        });

        s3Urls.push(uploadFile.url);
      }

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

      try {
        await this.trainAiDataset(targetUser.name, s3Urls);
        console.log(`[AI] Retrained model for ${targetUser.name}`);
      } catch (aiError: any) {
        console.warn("[AI] Train trigger failed:", aiError.message);
        return this.response.fail(
          "Dataset tersimpan, tetapi model AI gagal dilatih. Silakan coba lagi.",
          400,
        );
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
        images: dataset.dataset_images?.map((img) => ({
          id: img.id,
          file_path: EncryptionHelper.decrypt(img.file_path),
        })),
        image_count: dataset.dataset_images?.length ?? 0,
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
      await dataset.reload({
        include: [
          {
            association: "user",
            attributes: ["id", "name"],
          },
        ],
        transaction,
      });

      const personName = dataset.user?.name;

      await this.datasetImageModel.destroy({
        where: { dataset_id: dataset.id },
        transaction,
      });
      await dataset.destroy({ transaction });
      await transaction.commit();

      if (personName) {
        this.deleteAiDatasetInBackground(personName);
      }

      return this.response.success({}, 200, "Successfully delete dataset");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async removeAll(user: User) {
    if (user.role !== UserRoleEnum.HIRING_MANAGER) {
      return this.response.fail("Only hiring manager can delete dataset", 403);
    }

    let transaction: Transaction | null = null;

    try {
      await this.deleteAllAiDatasets();

      transaction = await this.sequelize.transaction();

      const datasetImages = await this.datasetImageModel.findAll({
        attributes: ["file_path"],
        transaction,
      });
      const filePaths = datasetImages
        .map((image) => {
          try {
            return EncryptionHelper.decrypt(image.file_path);
          } catch {
            return null;
          }
        })
        .filter(Boolean) as string[];

      await this.deleteStoredDatasetImages(filePaths);

      const deletedImageCount = await this.datasetImageModel.destroy({
        where: {},
        transaction,
      });
      const deletedDatasetCount = await this.datasetModel.destroy({
        where: {},
        transaction,
      });

      await transaction.commit();

      return this.response.success(
        {
          deleted_datasets: deletedDatasetCount,
          deleted_images: deletedImageCount,
        },
        200,
        "Successfully delete all datasets",
      );
    } catch (error) {
      if (transaction) await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
