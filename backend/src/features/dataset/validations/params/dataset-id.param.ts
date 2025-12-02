import * as Joi from "joi";
import { Dataset } from "src/features/dataset/entities/dataset.entity";

export const datasetIdExternal = async (value) => {
  const dataset = await Dataset.findOne({
    where: { id: value },
  });
  if (!dataset) {
    throw new Joi.ValidationError(
      "any.invalid-dataset-id",
      [
        {
          message: "dataset not found",
          path: ["id"],
          type: "any.invalid-dataset-id",
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
  return dataset;
};

export const datasetIdParamSchema = Joi.number()
  .required()
  .external(datasetIdExternal);
