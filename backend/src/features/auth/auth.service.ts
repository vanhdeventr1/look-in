import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { randomUUID } from "crypto";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { CreateUserDto } from "src/features/auth/dto/create-user.dto";
import { User } from "../user/entities/user.entity";
import UserRoleEnum from "../user/enums/user-role.enum";

@Injectable()
export class AuthService {
  private readonly revokedJwtIds = new Map<string, number>();

  constructor(
    private response: ResponseHelper,
    private sequelize: Sequelize,
    private jwtService: JwtService,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  login(user: any) {
    const jwtId = randomUUID();
    const payload = { email: user.email, sub: user.id, jti: jwtId };
    const result = {
      user,
      access_token: this.jwtService.sign(payload),
    };
    return this.response.success(result, 200);
  }

  async validateUser(username: string, password: string) {
    try {
      const user = await this.userModel.findOne({
        where: { [Op.or]: { email: username, username: username } },
        attributes: { include: ["password"] },
      });

      if (user) {
        const isValid = await Bun.password.verify(
          password,
          user.password.replace(/\$2y\$|\$2a\$/, "$2b$"),
        );

        if (isValid) {
          const result = user.toJSON();
          delete result.password;
          return result;
        }
      }

      return false;
    } catch (error) {
      console.log(error);
      return this.response.fail(error, HttpStatus.BAD_REQUEST);
    }
  }

  async validateJwt(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user?.is_active) return false;
    return user;
  }

  isJwtRevoked(jwtId?: string) {
    if (!jwtId) return true;

    const expiresAt = this.revokedJwtIds.get(jwtId);
    if (!expiresAt) return false;

    if (expiresAt < Date.now()) {
      this.revokedJwtIds.delete(jwtId);
      return false;
    }

    return true;
  }

  logout(token: string) {
    const decoded = token
      ? (this.jwtService.decode(token) as { exp?: number; jti?: string } | null)
      : null;
    if (decoded?.jti) {
      this.revokedJwtIds.set(decoded.jti, (decoded.exp ?? 0) * 1000);
    }

    return this.response.success({}, 200, "Successfully logout");
  }

  async register(createUserDto: CreateUserDto) {
    const hiringManagerCount = await this.userModel.count({
      where: { role: UserRoleEnum.HIRING_MANAGER },
    });

    if (hiringManagerCount > 0) {
      const expectedInviteCode = process.env.HR_REGISTER_INVITE_CODE;
      if (!expectedInviteCode) {
        return this.response.fail("Registration invite code is not configured", 403);
      }

      if (createUserDto.invite_code !== expectedInviteCode) {
        return this.response.fail("Invalid registration invite code", 403);
      }
    }

    const transaction = await this.sequelize.transaction();
    try {
      delete createUserDto.invite_code;
      createUserDto.password = await Bun.password.hash(createUserDto.password, {
        algorithm: "bcrypt",
        cost: 10,
      });
      const user = await this.userModel
        .create(
          {
            ...createUserDto,
            role: UserRoleEnum.HIRING_MANAGER,
          },
          { transaction },
        )
        .then((value) => value.toJSON());

      delete user.password;
      await transaction.commit();
      return this.response.success(
        user,
        HttpStatus.OK,
        "Successfully register user",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  profile(user: User) {
    return this.response.success(
      user,
      HttpStatus.OK,
      "Successfully get profile",
    );
  }
}
