import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from "sequelize-typescript";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { User } from "src/features/user/entities/user.entity";
//import { DatasetImage } from "src/features/dataset-image/entities/dataset-image.entity";

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
  name: number;

  @BelongsTo(() => User, {
    foreignKey: "name",
  })
  name_user: TypeWrapper<User>;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  created_by: number;

  @BelongsTo(() => User, {
    foreignKey: "created_by",
  })
  created_by_user: TypeWrapper<User>;

  //@HasMany(() => DatasetImage)
  //dataset_images: TypeWrapper<DatasetImage[]>;
}
