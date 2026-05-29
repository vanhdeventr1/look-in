import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { SharpHelper } from "src/cores/helpers/sharp.helper";
import { User } from "src/features/user/entities/user.entity";
import { PermitImage } from "../permit-image/entities/permit-image.entity";
import UserRoleEnum from "../user/enums/user-role.enum";
import { CreatePermitDto } from "./dto/create-permit.dto";
import { UpdatePermitDto } from "./dto/update-permit.dto";
import { Permit } from "./entities/permit.entity";
import { getPermitStatusLabel } from "./enums/permit-status.enum";

@Injectable()
export class PermitService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(Permit)
    private readonly permitModel: typeof Permit,
  ) {}

  private calculateTotalDays(start: Date, end: Date): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime =
      endDate.setHours(0, 0, 0, 0) - startDate.setHours(0, 0, 0, 0);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  async create(
    createPermitDto: CreatePermitDto,
    user: User,
    files: Array<Express.Multer.File>,
  ) {
    // upload + resize images in parallel BEFORE transaction
    let permitImages: Array<{ url: string; file_path: string }> = [];

    try {
      if (files && files.length > 0) {
        const sharpHelper = new SharpHelper();

        const uploadedFiles = await Promise.all(
          files.map((file) =>
            sharpHelper.resizeAndUpload(file, {
              path: Permit.imageOption.path,
              width: 800,
              height: 800,
              quality: 70,
            }),
          ),
        );

        permitImages = uploadedFiles.map((uploadFile) => {
          const image = new URL(uploadFile.url);

          return {
            url: image.href,
            file_path: image.pathname.substring(1),
          };
        });
      }

      const totalDays = this.calculateTotalDays(
        createPermitDto.date_start,
        createPermitDto.date_end,
      );

      // start transaction AFTER uploads completed
      const transaction = await this.sequelize.transaction();

      try {
        const permit = await this.permitModel.create(
          {
            ...createPermitDto,
            total_days: totalDays,
            created_by: user.id,
            user_id: user.id,
            permit_images: permitImages,
          },
          {
            transaction,
            include: ["permit_images"],
          },
        );

        await transaction.commit();

        // emit notification asynchronously
        setImmediate(() => {
          this.eventEmitter.emit("notification", ["system"], {
            type: "PERMIT",
            data: { id: permit.id },
            role: UserRoleEnum.HIRING_MANAGER,
            message: `${
              user.name || "Seorang karyawan"
            } telah mengajukan izin baru. Silakan lakukan persetujuan atau penolakan atas permohonan ini`,
            title: "New Permit Pending Approval",
          });
        });

        return this.response.success(permit, 201, "Successfully create permit");
      } catch (error) {
        await transaction.rollback();
        return this.response.fail(error, 400);
      }
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findAll(user: User, query: any) {
    const condition = {};
    if (user.role === UserRoleEnum.HIRING_MANAGER) {
      Object.assign(condition, { created_by: { [Op.ne]: user.id } });
    } else if (
      user.role === UserRoleEnum.EMPLOYEE ||
      user.role === UserRoleEnum.INTERN
    ) {
      Object.assign(condition, { "$permits.user_id$": user.id });
    }

    try {
      const { count, data } = await new QueryBuilderHelper(
        this.permitModel,
        query,
      )
        .where(condition)
        .load("created_by_user")
        .getResult();

      const permitImages = await PermitImage.findAll({
        where: { permit_id: data.map((permit) => permit.id) },
      });

      for (const permit of data) {
        permit.permit_images = permitImages.filter(
          (image) => image.permit_id === permit.id,
        );
      }

      return this.response.success(
        { count, permits: data },
        200,
        "Successfully get permits",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(permit: Permit) {
    try {
      await permit.reload({
        include: [
          { association: "permit_images" },
          {
            association: "created_by_user",
            attributes: { exclude: ["password"] },
          },
        ],
      });
      return this.response.success(permit, 200, "Successfully get permit");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async update(
    permit: Permit,
    updatePermitDto: UpdatePermitDto,
    user: User,
    files: Array<Express.Multer.File> = [],
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const statusChanged = updatePermitDto.status !== undefined;

      if (statusChanged && user.role !== UserRoleEnum.HIRING_MANAGER) {
        throw this.response.fail(
          "Only hiring managers can approve or change status",
          403,
        );
      }

      if (!statusChanged) {
        if (permit.user_id !== user.id) {
          throw this.response.fail("You can only update your own permit", 403);
        }

        if (permit.status !== 0) {
          throw this.response.fail("Only pending permits can be updated", 400);
        }
      }

      if (updatePermitDto.date_start || updatePermitDto.date_end) {
        const start = updatePermitDto.date_start ?? permit.date_start;
        const end = updatePermitDto.date_end ?? permit.date_end;
        updatePermitDto["total_days"] = this.calculateTotalDays(start, end);
      }

      if (statusChanged && permit.status !== updatePermitDto.status) {
        this.eventEmitter.emit("notification", ["system"], {
          type: "PERMIT",
          data: { id: permit.id },
          notified_user_id: permit.created_by,
          message: `Pengajuan izin berubah dari ${permit.status_name} menjadi ${getPermitStatusLabel(+updatePermitDto.status)}`,
          title: "Update Permit Status",
        });
      }

      if (files && files.length > 0) {
        const oldImages = await PermitImage.findAll({
          where: { permit_id: permit.id },
        });
        const { S3Helper } = await import("src/cores/helpers/s3.helper");
        const s3Helper = new S3Helper();
        for (const img of oldImages) {
          if (img.file_path) {
            try {
              await s3Helper.deleteFile(img.file_path);
            } catch (e) {
              console.error("Failed to delete S3 file", img.file_path, e);
            }
          }
          await img.destroy({ transaction });
        }

        const sharpHelper = new SharpHelper();
        const data = [];
        for (const file of files) {
          const uploadFile = await sharpHelper.resizeAndUpload(file, {
            path: Permit.imageOption.path,
          });
          const image = new URL(uploadFile.url);
          data.push({
            url: image.href,
            file_path: image.pathname.substring(1),
            permit_id: permit.id,
          });
        }
        await PermitImage.bulkCreate(data, { transaction });
      }

      await permit.update(updatePermitDto, { transaction });
      await transaction.commit();
      return this.response.success(permit, 200, "Successfully update permit");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(permit: Permit) {
    const transaction = await this.sequelize.transaction();
    try {
      await permit.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, "Successfully delete permit");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
