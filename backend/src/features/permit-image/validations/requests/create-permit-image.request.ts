import * as Joi from "joi";
import { updatePermitImageSchema } from "./update-permit-image.request";

export const createPermitImageSchema = Joi.object({
  permit_images: Joi.array()
    .items(Joi.object().concat(updatePermitImageSchema))
    .required()
    .default([]),
});
