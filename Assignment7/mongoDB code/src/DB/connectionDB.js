import { MongoClient } from "mongodb";
const client = new MongoClient("mongodb://localhost:27017");

const dbName = "mongoDb-app";
export const db = client.db(dbName);
export const checkConnectionDB = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to server");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
