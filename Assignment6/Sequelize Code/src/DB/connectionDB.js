import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("sequelize_app", "root", "root", {
  dialect: "mysql",
  host: "127.0.0.1",
});

export const checkConnectionDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const checkSyncDB = async () => {
  try {
    await sequelize.sync({ alter: false, force: false });
    console.log("sync has been established successfully.");
  } catch (error) {
    console.error("Unable to sync to the database:", error);
  }
};
