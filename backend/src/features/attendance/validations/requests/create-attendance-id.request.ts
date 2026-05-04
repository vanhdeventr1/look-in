import * as Joi from "joi";

export const createAttendanceSchema = Joi.object({
  gps_lat: Joi.string().required(),
  gps_lng: Joi.string().required(),
  note: Joi.string().optional().allow(null, ""),
});
