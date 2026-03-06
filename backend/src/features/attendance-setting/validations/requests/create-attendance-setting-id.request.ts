import * as Joi from "joi";

export const createAttendanceSettingSchema = Joi.object({
  check_in_time: Joi.string().required(),
  check_out_time: Joi.string().required(),
  gps_lat: Joi.string().required(),
  gps_lng: Joi.string().required(),
  radius_meter: Joi.number().integer().min(1).required(),
});
