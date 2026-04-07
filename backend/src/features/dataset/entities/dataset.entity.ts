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
import { DatasetImage } from "src/features/dataset-image/entities/dataset-image.entity";
import { User } from "src/features/user/entities/user.entity";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "datasets",
  modelName: "datasets",
})
export class Dataset extends Model {
  @PrimaryKey
  @Column({ type: DataType.BIGINT, autoIncrement: true })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  user_id: number;

  @BelongsTo(() => User, "user_id")
  user: TypeWrapper<User>;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  created_by: number;

  @BelongsTo(() => User, {
    foreignKey: "created_by",
  })
  created_by_user: TypeWrapper<User>;

  @HasMany(() => DatasetImage, { foreignKey: "dataset_id" })
  dataset_images: TypeWrapper<DatasetImage[]>;

  static imageOption = {
    path: "dataset/images",
  };
}
