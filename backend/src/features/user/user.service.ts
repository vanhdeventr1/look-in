import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { S3Helper } from "src/cores/helpers/s3.helper";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import UserRoleEnum from "./enums/user-role.enum";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(query: any, user: User) {
    try {
      const queryBuilder = new QueryBuilderHelper(this.userModel, query);
      if (user.role === UserRoleEnum.HIRING_MANAGER) {
        queryBuilder.where({ created_by: user.id });
      }

      const { count, data } = await queryBuilder.getResult();

      const result = {
        count: count,
        users: data,
      };
      return this.response.success(result, 200, "Successfully get users");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(user: User) {
    return this.response.success(user, 200, "Successfully get user");
  }

  async update(user: User, updateUserDto: Partial<UpdateUserDto>) {
    const transaction = await this.sequelize.transaction();
    try {
      if (updateUserDto.email || updateUserDto.username) {
        const duplicate = await this.userModel.findOne({
          where: {
            id: { [Op.ne]: user.id },
            [Op.or]: [
              ...(updateUserDto.email ? [{ email: updateUserDto.email }] : []),
              ...(updateUserDto.username
                ? [{ username: updateUserDto.username }]
                : []),
            ],
          },
          paranoid: false,
          transaction,
        });

        if (duplicate) {
          await transaction.rollback();
          return this.response.fail("Email or username already exists", 400);
        }
      }

      await user.update(updateUserDto, { transaction });
      await transaction.commit();
      return this.response.success({ user }, 200, "Successfully updated user");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async updateProfile(user: User, updateUserDto: UpdateUserDto) {
    const { name, email, username, phone_no } = updateUserDto;
    const profileDto = Object.fromEntries(
      Object.entries({ name, email, username, phone_no }).filter(
        ([, value]) => value !== undefined,
      ),
    );
    return this.update(user, profileDto);
  }

  async updateById(targetUser: User, updateUserDto: UpdateUserDto, user: User) {
    if (user.role !== UserRoleEnum.HIRING_MANAGER) {
      return this.response.fail("Forbidden", HttpStatus.FORBIDDEN);
    }

    if (targetUser.created_by !== user.id) {
      return this.response.fail("Forbidden", HttpStatus.FORBIDDEN);
    }

    if (targetUser.id === user.id) {
      return this.response.fail("Cannot manage your own account here", 400);
    }

    return this.update(targetUser, updateUserDto);
  }

  async create(dto: CreateEmployeeDto, creator: User) {
    if (creator.role !== UserRoleEnum.HIRING_MANAGER) {
      return this.response.fail("Only hiring manager can create employee", 403);
    }

    const transaction = await this.sequelize.transaction();
    try {
      const existing = await this.userModel.findOne({
        where: {
          [Op.or]: [{ email: dto.email }, { username: dto.username }],
        },
        paranoid: false,
        transaction,
      });
      if (existing) {
        await transaction.rollback();
        return this.response.fail("Email or username already exists", 400);
      }

      const hashedPassword = await Bun.password.hash(dto.password, {
        algorithm: "bcrypt",
        cost: 10,
      });

      const newUser = await this.userModel.create(
        {
          name: dto.name,
          email: dto.email,
          username: dto.username,
          phone_no: dto.phone_no ?? null,
          password: hashedPassword,
          created_by: creator.id,
          role: dto.role ?? UserRoleEnum.EMPLOYEE,
          is_active: dto.is_active ?? true,
        },
        { transaction },
      );

      await transaction.commit();

      const { password, ...result } = newUser.get({ plain: true });
      return this.response.success(
        result,
        201,
        "Employee created successfully",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async updatePhotoProfile(
    user: User,
    file: Express.Multer.File,
    actor: User,
  ) {
    if (
      actor.id !== user.id &&
      (actor.role !== UserRoleEnum.HIRING_MANAGER ||
        user.created_by !== actor.id)
    ) {
      return this.response.fail("Forbidden", HttpStatus.FORBIDDEN);
    }

    const transaction = await this.sequelize.transaction();
    try {
      const s3Helper = new S3Helper();
      if (user.file_path) {
        await s3Helper.deleteFile(user.file_path);
      }

      if (file) {
        const uploadResult = await s3Helper.uploadFile(
          file,
          "users/profile-photo",
          "public-read",
        );

        const imageUrl = new URL(uploadResult.Location);

        await user.update(
          { file_path: imageUrl.pathname.substring(1), url: imageUrl.href },
          { transaction },
        );
      } else {
        await user.update(
          {
            file_path: null,
            url: null,
          },
          { transaction },
        );
      }

      await transaction.commit();
      return this.response.success(
        user,
        200,
        "Successfully update photo profile",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await user.reload({ attributes: { include: ["password"] } });

      const isValid = await Bun.password.verify(
        changePasswordDto.old_password,
        user.password.replace(/\$2y\$|\$2a\$/, "$2b$"),
      );

      if (!isValid) {
        return this.response.fail("Invalid old password", 400);
      }

      changePasswordDto.new_password = await Bun.password.hash(
        changePasswordDto.new_password,
        {
          algorithm: "bcrypt",
          cost: 10,
        },
      );

      await user.update(
        { password: changePasswordDto.new_password },
        { transaction },
      );
      await transaction.commit();
      return this.response.success(user, 200, "Successfully change password");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(user: User, actor: User) {
    if (actor.role !== UserRoleEnum.HIRING_MANAGER) {
      return this.response.fail("Only hiring manager can delete user", 403);
    }

    if (user.created_by !== actor.id) {
      return this.response.fail("Forbidden", HttpStatus.FORBIDDEN);
    }

    if (user.id === actor.id) {
      return this.response.fail("Cannot delete your own account", 400);
    }

    await user.destroy();
    return this.response.success({}, 200, "Successfully delete user");
  }
}
