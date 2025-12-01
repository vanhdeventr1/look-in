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
import { ResizeOption } from "src/cores/helpers/sharp.helper";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { PermitImage } from "src/features/permit-image/entities/permit-image.entity";
import { User } from "src/features/user/entities/user.entity";
import { getPermitStatusLabel } from "../enums/permit-status.enum";
import { getPermitTypeLabel } from "../enums/permit-type.enum";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "permits",
  modelName: "permits",
})
export class Permit extends Model {
  @PrimaryKey
  @Column({ type: DataType.BIGINT, autoIncrement: true })
  id: number;
  
  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  user_id: number;
  
  @BelongsTo(() => User, {
    foreignKey: "user_id",
  })
  user: TypeWrapper<User>;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.TINYINT, allowNull: true, defaultValue: 0 })
  status: number;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return getPermitStatusLabel (this.getDataValue("status"));
    },
  })
  status_name: string;
  
  @Column({ type: DataType.TINYINT, allowNull: false})
  type: number;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return getPermitTypeLabel(this.getDataValue("type"));
    },
  })
  type_name: string;

  @Column({ type: DataType.DATE, allowNull: false })
  date_start: Date;
  
  @Column({ type: DataType.DATE, allowNull: false })
  date_end: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  created_by: number;

  @BelongsTo(() => User, {
    foreignKey: "created_by",
  })
  created_by_user: TypeWrapper<User>;

  @HasMany(() => PermitImage)
  permit_images: TypeWrapper<PermitImage[]>;

  static imageDimension: { permitImage: ResizeOption } = {
    permitImage: {
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
      path: "permit/images",
    },
  };
}
