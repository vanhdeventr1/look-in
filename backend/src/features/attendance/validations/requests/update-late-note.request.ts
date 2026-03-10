import * as Joi from "joi";

export const updateLateNoteSchema = Joi.object({
  note: Joi.string().trim().required(),
});
