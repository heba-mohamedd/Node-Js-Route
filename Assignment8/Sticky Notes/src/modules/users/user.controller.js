import { Router } from "express";
import * as US from "./user.service.js";
import { auth } from "../../middleware/auth.js";
const userRouter = Router();

userRouter.post("/signup", US.SignUp);
userRouter.post("/login", US.LogIn);
userRouter.patch("/", auth, US.UpdataUserInformation);
userRouter.delete("/", auth, US.DeleteUserAcount);
userRouter.get("/", auth, US.GetLoggedInUserData);
export default userRouter;
