import * as Joi from "joi";
import { PermitImage } from "../../entities/permit-image.entity";

export const permitImageIdExternal = async (value) => {
  const permitImage = await PermitImage.findOne({
    where: { id: value.id, permit_id: value.permitId },
  });
  if (!permitImage) {
    throw new Joi.ValidationError(
      "any.invalid-permit-image-id",
      [
        {
          message: "permit image not found",
          path: ["id"],
          type: "any.invalid-permit-image-id",
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
  return permitImage;
};

export const permitImageIdParamSchema = Joi.object()
  .required()
  .external(permitImageIdExternal);
