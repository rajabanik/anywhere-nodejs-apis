import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/connection";
import UserMiscellaneousDetails from "./userMiscellaneousDetailsModel";

export class UserRegistrations extends Model {
  public user_id!: string;
  public username!: string;
  public full_name!: string;
  public email!: string;
  public is_active!: boolean;
}

UserRegistrations.init(
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
    modelName: "UserRegistrations",
    timestamps: false,
  }
);

UserRegistrations.hasOne(UserMiscellaneousDetails, {
  foreignKey: "user_id",
  sourceKey: "user_id",
});
UserMiscellaneousDetails.belongsTo(UserRegistrations, {
  foreignKey: "user_id",
  targetKey: "user_id",
});

export default UserRegistrations;
