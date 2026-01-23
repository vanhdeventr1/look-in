import * as Joi from "joi";
import { updateDatasetImageSchema } from "./update-dataset-image.request";

export const createDatasetImageSchema = Joi.object({
  dataset_images: Joi.array()
    .items(Joi.object().concat(updateDatasetImageSchema))
    .required()
    .default([]),
});
