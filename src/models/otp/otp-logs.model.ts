import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/db-connection.config";
import { getCurrentDateTimeUTC } from "../../utils/datetime.util";
import UserRegistrations from "../users/user-registrations.model";

export class OtpLogs extends Model {
    public otp_id!: string;
    public user_id!: string;
    public otp!: number;
    public status!: string;
    public generated_on!: Date;
}

OtpLogs.init(
    {
        otp_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING,
            references: {
                model: UserRegistrations,
                key: "user_id",
            },
            allowNull: false,
        },
        otp: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        generated_on: {
            type: DataTypes.DATE,
            defaultValue: getCurrentDateTimeUTC(),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "otp_logs",
        modelName: "OtpLogs",
        timestamps: false,
    }
);

OtpLogs.belongsTo(UserRegistrations, {
    foreignKey: "user_id",
    targetKey: "user_id",
});

UserRegistrations.hasMany(OtpLogs, {
    foreignKey: "user_id",
    sourceKey: "user_id",
});

export default OtpLogs;
