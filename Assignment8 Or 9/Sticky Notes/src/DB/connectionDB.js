import mongoose from "mongoose";

export const checkConnectionDB = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/StickyNotes", {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
      console.log("Connected successfully to server");
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
    });
};

export default checkConnectionDB;
