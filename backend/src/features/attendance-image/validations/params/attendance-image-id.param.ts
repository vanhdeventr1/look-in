import * as Joi from "joi";
import { AttendanceImage } from "../../entities/attendance-image.entity";

export const attendanceImageIdExternal = async (value) => {
  const attendanceImage = await AttendanceImage.findOne({
    where: { id: value.id, attendance_id: value.attendanceId },
  });
  if (!attendanceImage) {
    throw new Joi.ValidationError(
      "any.invalid-attendance-image-id",
      [
        {
          message: "attendance image not found",
          path: ["id"],
          type: "any.invalid-attendance-image-id",
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
  return attendanceImage;
};

export const attendanceImageIdParamSchema = Joi.object()
  .required()
  .external(attendanceImageIdExternal);
