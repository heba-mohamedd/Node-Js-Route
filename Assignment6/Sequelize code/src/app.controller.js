// const express = require("express");
// const { checkConnectionDB } = require("./DB/connectionDB.js");
// const { userRouter } = require("./modules/users/user.controller.js");
// const { blogRouter } = require("./modules/blogs/blog.controller.js");
import express from "express";
import { checkConnectionDB } from "./DB/connectionDB.js";
import { userRouter } from "./modules/users/user.controller.js";
import { blogRouter } from "./modules/blogs/blog.controller.js";
const app = express();
const port = 3000;
export const bootstrap = () => {
  app.use(express.json());
  checkConnectionDB();

  app.get("/", (req, res, next) => {
    return res.status(200).json({ message: "Wellcome on my app .." });
  });

  app.use("/users", userRouter);
  app.use("/blogs", blogRouter);

  app.use("{/*demo}", (req, res, next) => {
    return res
      .status(404)
      .json({ message: `404 Url ${req.originalUrl} Not Found .....` });
  });

  app.listen(port, () => {
    console.log(`Server is running in port ${port}....`);
  });
};

// module.exports = bootstrap;
