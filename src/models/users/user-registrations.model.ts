import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/db-connection.config";
import UserMiscellaneousDetails from "./user-miscellaneous-details.model";
import { getCurrentDateTimeUTC } from "../../utils/datetime.util";

export class UserRegistrations extends Model {
  public user_id!: string;
  public username!: string;
  public full_name!: string;
  public email!: string;
  public is_active!: boolean;
  UserMiscellaneousDetail: any;
}

UserRegistrations.init(
  {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
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
    created_on: {
      type: DataTypes.DATE,
      defaultValue: getCurrentDateTimeUTC(),
      allowNull: false,
    },
    deactivated_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
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
