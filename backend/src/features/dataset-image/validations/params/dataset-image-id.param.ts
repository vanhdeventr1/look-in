import * as Joi from "joi";
import { DatasetImage } from "../../entities/dataset-image.entity";

export const datasetImageIdExternal = async (value) => {
  const datasetImage = await DatasetImage.findOne({
    where: { id: value.id, dataset_id: value.datasetId },
  });
  if (!datasetImage) {
    throw new Joi.ValidationError(
      "any.invalid-dataset-image-id",
      [
        {
          message: "dataset image not found",
          path: ["id"],
          type: "any.invalid-dataset-image-id",
          context: {
            key: "id",
            label: "id",
            value,
          },
        },
      ],
      value,
    );
  }
  return datasetImage;
};

export const datasetImageIdParamSchema = Joi.object()
  .required()
  .external(datasetImageIdExternal);
