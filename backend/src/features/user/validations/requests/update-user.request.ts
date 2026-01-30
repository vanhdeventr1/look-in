import * as Joi from "joi";
import { getUserRoleEnums } from "../../enums/user-role.enum";

const userRoleEnum = getUserRoleEnums().map((value) => +value.id);

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  username: Joi.string().optional(),
  phone_no: Joi.string().optional().allow(null, ""),
  role: Joi.number()
    .optional()
    .valid(...userRoleEnum),
  is_active: Joi.boolean().optional().default(true),
});
