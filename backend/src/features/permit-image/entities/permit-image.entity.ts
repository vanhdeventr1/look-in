import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { Permit } from "src/features/permit/entities/permit.entity";

@Table({
  createdAt: "created_at",
  updatedAt: "updated_at",
  timestamps: true,
  tableName: "permit_images",
  modelName: "permit_images",
})
export class PermitImage extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Permit)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  permit_id: number;

  @BelongsTo(() => Permit)
  permit: TypeWrapper<Permit>;

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

  static imageOption = {
    path: "permit/images",
  };
}
