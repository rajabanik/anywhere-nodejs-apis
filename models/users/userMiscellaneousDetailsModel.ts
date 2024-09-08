import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/dbConnectionConfig";
import UserRegistrations from "./userRegistrationsModel";

export class UserMiscellaneousDetails extends Model {
  public misc_id!: number;
  public user_id!: string;
  public bio!: string;
  public preferences!: string;
  public age!: number;
  public gender!: string;
  public country!: string;
  public profile_photo_storage_bucket_filepath!: string;
}

UserMiscellaneousDetails.init(
  {
    misc_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_photo_storage_bucket_filepath: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: "user_miscellaneous_details",
    modelName: "UserMiscellaneousDetails",
    timestamps: false,
  }
);

export default UserMiscellaneousDetails;
