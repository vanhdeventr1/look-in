import * as Joi from "joi";

export const createAttendanceSchema = Joi.object({
  clock_in: Joi.date().optional().allow(null),
  clock_out: Joi.date().optional().allow(null),
  is_late: Joi.boolean().optional().default(false),
  late_duration: Joi.number().integer().min(0).optional().default(0),
  gps_lat: Joi.string().optional().allow(null, ""),
  gps_lng: Joi.string().optional().allow(null, ""),
  attendance_setting_id: Joi.number().integer().optional().allow(null),
  permit_id: Joi.number().integer().optional().allow(null),
  note: Joi.string().optional().allow(null, ""),
});
