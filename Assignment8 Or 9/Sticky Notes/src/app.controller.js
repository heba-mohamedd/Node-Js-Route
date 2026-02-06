import express from "express";
import userRouter from "./modules/users/user.controller.js";
import checkConnectionDB from "./DB/connectionDB.js";
import noteRouter from "./modules/notes/note.controller.js";
const app = express();
const port = 3000;

const bootstrap = () => {
  app.use(express.json());
  app.get("/", (req, res) => res.send("Hello World!"));
  checkConnectionDB();

  app.use("/users", userRouter);
  app.use("/notes", noteRouter);

  app.use("{/*demo}", (req, res, next) => {
    return res
      .status(404)
      .json({ message: `Url ${req.originalUrl} 404 Not Found` });
  });
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};

export default bootstrap;
