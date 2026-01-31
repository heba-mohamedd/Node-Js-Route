import express from "express";
import { checkConnectionDB, db } from "./DB/connectionDB.js";
import bookRouter from "./modules/books/books.controller.js";
import logRouter from "./modules/logs/logs.controller.js";
import authorRouter from "./modules/authors/authors.controller.js";
import { booksModel } from "./DB/models/books.model.js";
import { authorsModel } from "./DB/models/authors.model.js";
const app = express();
const port = 3000;

const bootstrap = () => {
  checkConnectionDB();
  app.use(express.json());
  app.get("/", (req, res, next) => res.send("hello world"));

  app.post("/collection/books", async (req, res, next) => {
    try {
      await db.createCollection("books", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            properties: {
              title: {
                bsonType: "string",
                minLength: 1,
              },
            },
          },
        },
      });

      return res
        .status(201)
        .json({ message: "Collection created successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "Catch error",
        error: error.message,
      });
    }
  });
  app.post("/collection/authors", async (req, res, next) => {
    try {
      const { name, nationality } = req.body;
      console.log(req.body);

      await authorsModel.insertOne({
        name,
        nationality,
      });
      return res.status(201).json({ message: "data inserted successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "Catch error",
        error: error.message,
      });
    }
  });
  app.post("/collection/logs", async (req, res, next) => {
    try {
      const result = await db.createCollection("logs", {
        capped: true,
        size: 1048576,
      });
      return res.status(201).json({ message: "Create successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "Catch error",
        error: error.message,
      });
    }
  });

  app.post("/collection/books/index", async (req, res, next) => {
    try {
      const result = await booksModel.createIndex({ title: 1 });
      return res.status(201).json({
        message: "index on title created successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Catch error",
        error: error.message,
      });
    }
  });

  app.use("/books", bookRouter);
  app.use("/logs", logRouter);
  app.use("/authors", authorRouter);

  app.use("{/*demo}", (req, res, next) => {
    return res
      .status(404)
      .json({ message: `404 Url ${req.originalUrl} Not Found .....` });
  });

  app.listen(port, () => {
    console.log(`Server is running in port ${port}....`);
  });
};
export default bootstrap;
