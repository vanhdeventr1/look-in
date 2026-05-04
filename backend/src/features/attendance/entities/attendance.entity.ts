import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { AttendanceImage } from "src/features/attendance-image/entities/attendance-image.entity";
import { AttendanceSetting } from "src/features/attendance-setting/entities/attendance-setting.entity";
// import { Permit } from "src/features/permit/entities/permit.entity";
import { User } from "src/features/user/entities/user.entity";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "attendances",
  modelName: "attendances",
})
export class Attendance extends Model {
  @PrimaryKey
  @Column({ type: DataType.BIGINT, autoIncrement: true })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  user_id: number;

  @BelongsTo(() => User, { foreignKey: "user_id" })
  user: TypeWrapper<User>;

  @Column({ type: DataType.DATE, allowNull: true })
  clock_in: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  clock_out: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_late: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  late_duration: number;

  @Column({ type: DataType.STRING, allowNull: true })
  gps_lat: string;

  @Column({ type: DataType.STRING, allowNull: true })
  gps_lng: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  note: string;

  @Column({ type: DataType.FLOAT, allowNull: true })
  face_confidence: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_face_verified: boolean;

  @ForeignKey(() => AttendanceSetting)
  @Column({ type: DataType.BIGINT, allowNull: true })
  attendance_setting_id: number;

  @BelongsTo(() => AttendanceSetting, { foreignKey: "attendance_setting_id" })
  attendance_setting: TypeWrapper<AttendanceSetting>;

  // @ForeignKey(() => Permit)
  // @Column({ type: DataType.BIGINT, allowNull: true })
  // permit_id: number;

  // @BelongsTo(() => Permit, { foreignKey: "permit_id" })
  // permit: TypeWrapper<Permit>;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  created_by: number;

  @BelongsTo(() => User, { foreignKey: "created_by" })
  created_by_user: TypeWrapper<User>;

  @HasMany(() => AttendanceImage)
  attendance_images: TypeWrapper<AttendanceImage[]>;

  static imageOption = {
    path: "attendance/images",
  };
}
