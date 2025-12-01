import * as Joi from "joi";
import { createPermitImageSchema } from "src/features/permit-image/validations/requests/create-permit-image.request";

export const createPermitSchema = Joi.object({
  description: Joi.string().optional().allow(null, "").default(""),
  type: Joi.number().required(),
  status: Joi.number().optional().default(0),
  date_start: Joi.date().required(),
  date_end: Joi.date().required(),
}).concat(createPermitImageSchema);
