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

  async create(
    createPermitDto: CreatePermitDto,
    user: User,
    files: Array<Express.Multer.File>,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const permitImageInstance = [];
      const data = [];
      const sharpHelper = new SharpHelper();
      
      for (const file of files) {
        const uploadFile = sharpHelper
        .resizeAndUpload(file, Permit.imageDimension.permitImage)
        .then((value) => {
          const image = new URL(value.url);
          
          data.push({
          url: image.href,
          file_path: image.pathname.substring(1),
        });
    });

  permitImageInstance.push(uploadFile);
}

      await Promise.all(permitImageInstance);

      const permit = await this.permitModel.create(
        {
          ...createPermitDto,
          description: createPermitDto.description,
          created_by: user.id,
          user_id: user.id,
          permit_images: data,
          type: createPermitDto.type,
        },
        {
          transaction,
          include: ["permit_images"],
        },
      );

      await transaction.commit();
      return this.response.success(permit, 201, "Successfully create permit");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
  
  async findAll(user: User, query: any) {
    const condition = {};
    if (user.role === UserRoleEnum.HIRING_MANAGER) {
  Object.assign(condition, {
    created_by: { [Op.ne]: user.id },
  });
} else if (user.role === UserRoleEnum.EMPLOYEE || user.role === UserRoleEnum.INTERN) {
      Object.assign(condition, {
        "$permits.user_id$": user.id,
      });
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
    where: {
      permit_id: data.map((permit) => permit.id),
    },
  });

  for (const permit of data) {
    const permitImage = permitImages.filter(
      (image) => image.permit_id === permit.id,
    );

    permit.permit_images = permitImage;
  }

  const result = {
    count,
    permits: data,
  };

  return this.response.success(
    result,
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

      return this.response.success(
        permit,
        200,
        "Successfully get permit",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async update(permit: Permit, updatePermitDto: UpdatePermitDto, user: User) {
  const transaction = await this.sequelize.transaction();
  try {
    const status = updatePermitDto.status !== undefined;
    if (status) {
      if (user.role !== UserRoleEnum.HIRING_MANAGER) {
        throw this.response.fail(
          "Only hiring managers can approve or change status",
          403,
        );
      }
    }

    if (
      status &&
      permit.status !== updatePermitDto.status
    ) {
      this.eventEmitter.emit("notification", ["system"], {
        type: "PERMIT",
        data: { id: permit.id },
        notified_user_id: permit.created_by,
        message: `Permit status change from ${permit.status_name} to ${getPermitStatusLabel(+updatePermitDto.status)}`,
        title: "Update Permit Status",
      });
    }
    await permit.update(updatePermitDto, { transaction });
    await transaction.commit();

    return this.response.success(
      permit,
      200,
      "Successfully update permit",
    );
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
      return this.response.success(
        {},
        200,
        "Successfully delete permit",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
