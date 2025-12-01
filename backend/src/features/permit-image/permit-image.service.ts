import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { SharpHelper } from "src/cores/helpers/sharp.helper";
import { Permit } from "../permit/entities/permit.entity";
import { CreatePermitImageDto } from "./dto/create-permit-image.dto";
import { UpdatePermitImageDto } from "./dto/update-permit-image.dto";
import { PermitImage } from "./entities/permit-image.entity";

@Injectable()
export class PermitImageService {
  constructor(
    private response: ResponseHelper,
    private sequelize: Sequelize,
    @InjectModel(PermitImage)
    private permitImageModel: typeof PermitImage,
  ) {}

  async create(
    permit: Permit,
    createPermitImageDto: CreatePermitImageDto,
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
        permitImage,
      ] of createPermitImageDto.permit_images.entries()) {
        const file = files[index];
        if (!files[index]) {
          return this.response.fail(`Image at index ${index} is required`, 400);
        }

        const uploadResult = await sharpHelper.resizeAndUpload(
          file,
          this.permitImageModel.imageDimension.permitImage,
        );

        const imageUrl = new URL(uploadResult.url);
        permitImage.file_path = imageUrl.pathname.substring(1);
        permitImage.url = imageUrl.href;
        permitImage.permit_id = permit.id;
      }

      const permitImages =
        await this.permitImageModel.bulkCreate(
          createPermitImageDto.permit_images,
          { transaction },
        );

      await transaction.commit();
      return this.response.success(
        permitImages,
        201,
        "Successfully create permit image",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async findAll(permit: Permit, query: any) {
    const { count, data } = await new QueryBuilderHelper(
      this.permitImageModel,
      query,
    )
      .where({ permit_id: permit.id })
      .getResult();

    const result = {
      count: count,
      submission_images: data,
    };

    return this.response.success(
      result,
      200,
      "Successfully get location submission images",
    );
  }

  async update(
    permitImage: PermitImage,
    updatePermitImageDto: UpdatePermitImageDto,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      await permitImage.update(updatePermitImageDto, {
        transaction,
      });

      await transaction.commit();
      return this.response.success(
        permitImage,
        200,
        "Successfully update permit image",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(permitImage: PermitImage) {
    const transaction = await this.sequelize.transaction();
    try {
      if (permitImage.file_path) {
        const sharpHelper = new SharpHelper();
        await sharpHelper.delete(
          permitImage.file_path,
          this.permitImageModel.imageDimension.permitImage,
        );
      }

      await permitImage.destroy({ transaction });
      await transaction.commit();

      return this.response.success(
        {},
        200,
        "Successfully delete location submission image",
      );
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return this.response.fail("Failed delete location submission image", 400);
    }
  }
}
