import * as Joi from "joi";
import UserRoleEnum from "../../enums/user-role.enum";

export const createEmployeeSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  username: Joi.string().trim().required(),
  password: Joi.string().min(8).required(),
  phone_no: Joi.string().trim().optional().allow(null, ""),
  role: Joi.number()
    .optional()
    .valid(UserRoleEnum.EMPLOYEE, UserRoleEnum.INTERN)
    .default(UserRoleEnum.EMPLOYEE),
  is_active: Joi.boolean().optional().default(true),
});
