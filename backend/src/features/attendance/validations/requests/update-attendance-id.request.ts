import * as Joi from "joi";

export const updateAttendanceSchema = Joi.object({
  clock_in: Joi.date().optional().allow(null),
  clock_out: Joi.date().optional().allow(null),
  gps_lat: Joi.string().optional().allow(null, ""),
  gps_lng: Joi.string().optional().allow(null, ""),
  permit_id: Joi.number().integer().optional().allow(null),
  note: Joi.string().trim().allow(null, "").optional(),
});
