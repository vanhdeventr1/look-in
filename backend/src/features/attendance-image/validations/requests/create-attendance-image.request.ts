import * as Joi from "joi";

export const createAttendanceImageSchema = Joi.object({
  attendance_images: Joi.array().items(Joi.object()).optional().default([]),
});
