import * as Joi from "joi";
import { AttendanceSetting } from "../../entities/attendance-setting.entity";

export const attendanceSettingIdExternal = async (value) => {
  const attendanceSetting = await AttendanceSetting.findOne({
    where: { id: value },
  });
  if (!attendanceSetting) {
    throw new Joi.ValidationError(
      "any.invalid-attendance-setting-id",
      [
        {
          message: "attendance setting not found",
          path: ["id"],
          type: "any.invalid-attendance-setting-id",
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
  return attendanceSetting;
};

export const attendanceSettingIdParamSchema = Joi.number()
  .required()
  .external(attendanceSettingIdExternal);
