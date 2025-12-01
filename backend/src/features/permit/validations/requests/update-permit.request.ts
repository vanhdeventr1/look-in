import * as Joi from "joi";
import { createLocationSubmissionImageSchema } from "src/features/location-submission-image/validations/requests/create-location-submission-image.request";

export const updatePermitSchema = Joi.object({
  description: Joi.string().optional().allow(null, ""),
  type: Joi.number().optional(),
  status: Joi.number().optional(),
  date_start: Joi.date().optional(),
  date_end: Joi.date().optional(),
}).concat(createLocationSubmissionImageSchema);
