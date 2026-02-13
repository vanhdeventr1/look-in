import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { ResizeOption } from "src/cores/helpers/sharp.helper";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { Attendance } from "src/features/attendance/entities/attendance.entity";

@Table({
  createdAt: "created_at",
  updatedAt: "updated_at",
  timestamps: true,
  tableName: "attendance_images",
  modelName: "attendance_images",
})
export class AttendanceImage extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Attendance)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  attendance_id: number;

  @BelongsTo(() => Attendance)
  attendance: TypeWrapper<Attendance>;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  url: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  file_path: string;

  static imageDimension: { attendanceImage: ResizeOption } = {
    attendanceImage: {
      dimensions: [
        {
          width: 100,
          fit: "inside",
          prefix: "100",
        },
        {
          width: 500,
          fit: "inside",
          prefix: "500",
        },
      ],
      path: "attendance/images",
    },
  };
}
