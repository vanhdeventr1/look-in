import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { SharpHelper } from "src/cores/helpers/sharp.helper";
import { Attendance } from "../attendance/entities/attendance.entity";
import { CreateAttendanceImageDto } from "./dto/create-attendance-image.dto";
import { AttendanceImage } from "./entities/attendance-image.entity";

@Injectable()
export class AttendanceImageService {
  constructor(
    private response: ResponseHelper,
    private sequelize: Sequelize,
    @InjectModel(AttendanceImage)
    private readonly attendanceImageModel: typeof AttendanceImage,
  ) {}

  async create(
    attendance: Attendance,
    createAttendanceImageDto: CreateAttendanceImageDto,
    files: Array<Express.Multer.File>,
  ) {
    if (!files.length) {
      return this.response.fail("Image is required", 400);
    }
    const transaction = await this.sequelize.transaction();
    try {
      const sharpHelper = new SharpHelper();
      for (const [
        index,
        attendanceImage,
      ] of createAttendanceImageDto.attendance_images.entries()) {
        const file = files[index];
        if (!files[index]) {
          return this.response.fail(`Image at index ${index} is required`, 400);
        }

        const uploadResult = await sharpHelper.resizeAndUpload(
          file,
          this.attendanceImageModel.imageDimension.attendanceImage,
        );

        const imageUrl = new URL(uploadResult.url);
        attendanceImage.file_path = imageUrl.pathname.substring(1);
        attendanceImage.url = imageUrl.href;
        attendanceImage.attendance_id = attendance.id;
      }

      const attendanceImages = await this.attendanceImageModel.bulkCreate(
        createAttendanceImageDto.attendance_images,
        { transaction },
      );

      await transaction.commit();
      return this.response.success(
        attendanceImages,
        201,
        "Successfully create attendance image",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async findAll(attendance: Attendance, query: any) {
    const { count, data } = await new QueryBuilderHelper(
      this.attendanceImageModel,
      query,
    )
      .where({ attendance_id: attendance.id })
      .getResult();

    const result = {
      count: count,
      attendance_images: data,
    };

    return this.response.success(
      result,
      200,
      "Successfully get attendance images",
    );
  }
}
