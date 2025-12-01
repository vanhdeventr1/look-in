import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { getUserRoleEnumLabel } from "../enums/user-role.enum";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "users",
  modelName: "users",
})
@DefaultScope(() => ({
  attributes: {
    exclude: ["password"],
  },
}))
export class User extends Model {
  @Column(DataType.STRING)
  name: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  username: string;

  @Column(DataType.STRING)
  password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  phone_no: string;

  @Column({ type: DataType.TINYINT, allowNull: true })
  role: number;

   @Column({
    type: DataType.VIRTUAL,
    get(this: User) {
      return getUserRoleEnumLabel(this.getDataValue('role'));
    },
  })
  role_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  file_path: string;

 @Column({ type: DataType.STRING, allowNull: true })
  url: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  is_active: boolean;

   @ForeignKey(() => User)
    @Column({ type: DataType.BIGINT, allowNull: true })
    created_by: number;
  
    @BelongsTo(() => User, {
      foreignKey: "created_by",
    })
    created_by_user: TypeWrapper<User>;
}
