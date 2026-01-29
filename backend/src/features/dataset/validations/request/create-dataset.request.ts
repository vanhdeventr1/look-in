// src/features/dataset/validations/request/create-dataset.request.ts
import * as Joi from "joi";
import { User } from "src/features/user/entities/user.entity";
import UserRoleEnum from "src/features/user/enums/user-role.enum"; // Adjust path

export const createDatasetSchema = Joi.object({
  name: Joi.number()
    .required()
    .external(async (value) => {
      const employee = await User.findOne({
        where: {
          id: value,
          role: UserRoleEnum.EMPLOYEE, // Ensure we only add datasets to Employees
        },
      });

      if (!employee) {
        throw new Joi.ValidationError(
          "any.invalid-employee-id",
          [
            {
              message: "Employee not found or invalid role",
              path: ["name"],
              type: "any.invalid-employee-id",
              context: { key: "name", value },
            },
          ],
          value,
        );
      }
      return value; // Joi external needs to return the value
    }),
});
