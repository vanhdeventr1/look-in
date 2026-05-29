import * as Joi from "joi";
import UserRoleEnum from "../../enums/user-role.enum";

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  username: Joi.string().optional(),
  phone_no: Joi.string().optional().allow(null, ""),
  role: Joi.number()
    .optional()
    .valid(UserRoleEnum.EMPLOYEE, UserRoleEnum.INTERN),
  is_active: Joi.boolean().optional(),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  username: Joi.string().optional(),
  phone_no: Joi.string().optional().allow(null, ""),
});
