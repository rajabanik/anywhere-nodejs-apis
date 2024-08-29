import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: "dpg-cr89qi2j1k6c739r7220-a.oregon-postgres.render.com",
  port: 5432,
  username: "dev_anywhere",
  password: "bF1vRmbaimfapvaOaDoSOK4j1p0nJGm9",
  database: "anywhere_db",
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
