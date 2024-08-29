import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "",
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER || "",
  password: process.env.DB_USER_PASS || "",
  database: process.env.DB_NAME || "",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
});

export const conn = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Connection established successfully.");
  } catch (error) {
    console.error("Connection failed:", error);
  }
};
