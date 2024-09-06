import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/connection";
import UserRegistrations from "./userRegistrationsModel";

export class UserMiscellaneousDetails extends Model {
  public misc_id!: number;
  public user_id!: string;
  public bio!: string;
  public preferences!: string;
  public age!: number;
  public country!: string;
}

UserMiscellaneousDetails.init(
  {
    misc_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UserRegistrations,
        key: "user_id",
      },
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preferences: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "user_miscellaneous_details",
    modelName: "UserMiscellaneousDetails",
    timestamps: false,
  }
);

export default UserMiscellaneousDetails;
