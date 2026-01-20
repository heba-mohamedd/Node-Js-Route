import express from "express";
import { checkConnectionDB, checkSyncDB } from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
import postRouter from "./modules/posts/post.controller.js";
import commentRouter from "./modules/comments/comment.controller.js";
import "./DB/models/associations.js";
const app = express();
const port = 3000;

const bootstrap = () => {
  app.use(express.json());
  checkConnectionDB();
  checkSyncDB();

  app.get("/", (req, res, next) => {
    return res.status(200).json({ message: "wellcome in my app" });
  });

  app.use("/users", userRouter);
  app.use("/posts", postRouter);
  app.use("/comments", commentRouter);

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
