// const { Router } = require("express");
// const {
//   getAllUsers,
//   signUp,
//   signIn,
//   deleteProfile,
//   getProfile,
//   updataProfile,
// } = require("./user.service.js");
// const EmailExist = require("../../middleware/emailExist.js");

import { EmailExist } from "../../middleware/emailExist.js";
import { Router } from "express";
import {
  deleteProfile,
  getAllUsers,
  getProfile,
  signIn,
  signUp,
  updataProfile,
} from "./user.service.js";

// const UserIdExist = require("../../middleware/userIdExist.js");
export const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup", EmailExist, signUp);
userRouter.post("/signin", signIn);
userRouter.delete("/:userId", deleteProfile);
userRouter.get("/profile/:userId", getProfile);
userRouter.patch("/updata/:userId", updataProfile);

// module.exports = { userRouter };
