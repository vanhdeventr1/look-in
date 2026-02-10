import * as Joi from "joi";
import { User } from "src/features/user/entities/user.entity";
import UserRoleEnum from "src/features/user/enums/user-role.enum";

export const createDatasetSchema = Joi.object({
  user_id: Joi.number()
    .required()
    .external(async (value) => {
      const userFound = await User.findOne({
        where: { id: value },
      });

      if (!userFound) {
        throw new Joi.ValidationError(
          "any.invalid-user-id",
          [
            {
              message: "User not found in database",
              path: ["user_id"],
              type: "any.invalid-user-id",
              context: { key: "user_id", value },
            },
          ],
          value,
        );
      }

      const allowedRoles = [UserRoleEnum.EMPLOYEE, UserRoleEnum.INTERN];
      if (!allowedRoles.includes(userFound.role)) {
      }

      return value;
    }),
});
