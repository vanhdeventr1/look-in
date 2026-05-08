import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { Dataset } from "src/features/dataset/entities/dataset.entity";

@Table({
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  timestamps: true,
  tableName: "dataset_images",
  modelName: "dataset_images",
})
export class DatasetImage extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Dataset)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  dataset_id: number;

  @BelongsTo(() => Dataset)
  dataset: TypeWrapper<Dataset>;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  file_path: string;

  static imageOption = {
    path: "dataset/images",
  };
}
