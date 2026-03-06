import * as Joi from "joi";

export const updateAttendanceSettingSchema = Joi.object({
  check_in_time: Joi.string().optional(),
  check_out_time: Joi.string().optional(),
  gps_lat: Joi.string().optional(),
  gps_lng: Joi.string().optional(),
  radius_meter: Joi.number().integer().min(1).optional(),
});
