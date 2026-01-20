import { Router } from "express";
import * as US from "./user.service.js";
import { signupValidation } from "../../middleware/signupValidation.js";
const userRouter = Router();

userRouter.post("/signup", US.signUp);
userRouter.put("/:id", US.updataOrCreateUser);
userRouter.get("/by-email", US.getUserByEmail);
userRouter.get("/:id", US.getUserByPK);

export default userRouter;
