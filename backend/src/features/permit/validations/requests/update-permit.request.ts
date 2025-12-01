import * as Joi from "joi";
import { createPermitImageSchema } from "src/features/permit-image/validations/requests/create-permit-image.request";

export const updatePermitSchema = Joi.object({
  description: Joi.string().optional().allow(null, ""),
  type: Joi.number().optional(),
  status: Joi.number().optional(),
  date_start: Joi.date().optional(),
  date_end: Joi.date().optional(),
}).concat(createPermitImageSchema);
