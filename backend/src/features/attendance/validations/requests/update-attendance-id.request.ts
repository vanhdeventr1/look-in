import * as Joi from "joi";

export const updateAttendanceSchema = Joi.object({
  note: Joi.string().trim().required(),
});
