// const { Router } = require("express");
// const { createBlog, getBlogs } = require("./blog.service.js");
// const UserIdExist = require("../../middleware/userIdExist.js");

import { Router } from "express";
import { UserIdExist } from "../../middleware/userIdExist.js";
import { createBlog, getBlogs } from "./blog.service.js";

export const blogRouter = Router();

blogRouter.post("/create", UserIdExist, createBlog);
blogRouter.get("/", getBlogs);

// module.exports = { blogRouter };
