import * as Joi from "joi";

export const createAttendanceSchema = Joi.object({
  clock_out: Joi.date().optional().allow(null),
  gps_lat: Joi.string().required(),
  gps_lng: Joi.string().required(),
  permit_id: Joi.number().integer().optional().allow(null),
  note: Joi.string().optional().allow(null, ""),
});
