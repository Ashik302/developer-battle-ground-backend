import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequalize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    dialect: "mysql",
    logging: console.log,
  },
);

export const connectToDatabase = async () => {
  try {
    await sequalize.authenticate();
    console.log("Connection has been established successfully.");
    await sequalize.sync({ alter: true }); // 🔥 THIS CREATES TABLES
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
