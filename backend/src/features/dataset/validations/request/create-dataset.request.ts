import * as Joi from "joi";
import { User } from "src/features/user/entities/user.entity";

export const createDatasetSchema = Joi.object({
  name: Joi.number()
    .required()
    .external(async (value) => {
      const employee = await User.findOne({ where: { id: value } });
      if (!employee) {
        throw new Joi.ValidationError(
          "any.invalid-employee-id",
          [
            {
              message: "Employee not found",
              path: ["name"],
              type: "any.invalid-employee-id",
              context: { key: "name", value },
            },
          ],
          value
        );
      }
    }),
});
