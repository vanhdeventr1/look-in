import * as Joi from "joi";
import { Permit } from "../../entities/permit.entity";

export const permitIdExternal = async (value) => {
  const permit = await Permit.findOne({
    where: { id: value },
  });
  if (!permit) {
    throw new Joi.ValidationError(
      "any.invalid-permit-id",
      [
        {
          message: "permit not found",
          path: ["id"],
          type: "any.invalid-permit-id",
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
  return permit;
};

export const permitIdParamSchema = Joi.number()
  .required()
  .external(permitIdExternal);
