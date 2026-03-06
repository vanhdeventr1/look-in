import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { Attendance } from "src/features/attendance/entities/attendance.entity";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "attendance_settings",
  modelName: "attendance_settings",
})
export class AttendanceSetting extends Model {
  @PrimaryKey
  @Column({ type: DataType.BIGINT, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  gps_lat: string;

  @Column({ type: DataType.STRING, allowNull: false })
  gps_lng: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 100 })
  radius_meter: number;

  @Column({ type: DataType.TIME, allowNull: false })
  check_in_time: string;

  @Column({ type: DataType.TIME, allowNull: false })
  check_out_time: string;

  @HasMany(() => Attendance, { foreignKey: "attendance_setting_id" })
  attendance: TypeWrapper<Attendance[]>;
}
