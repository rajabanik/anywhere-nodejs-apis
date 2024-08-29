// userModel.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/connection";

export class User extends Model {
  public user_id !: string;
  public username!: string;
  public full_name!: string;
  public email!: string;
}

User.init(
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deactivation_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "user_registrations",
    modelName: "User",
    timestamps: false,
  }
);

export default User;
