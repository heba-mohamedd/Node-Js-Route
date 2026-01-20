import { Router } from "express";
import * as CM from "./comment.service.js";

const commentRouter = Router();

commentRouter.post("/", CM.createComments);
commentRouter.patch("/:commentId", CM.updataComment);
commentRouter.post("/find-or-create", CM.findOrCreateComment);
commentRouter.get("/search", CM.findAndCount);
commentRouter.get("/newest/:postId", CM.getNewsetComments);
commentRouter.get("/details/:id", CM.getCommentWithAllInformation);

export default commentRouter;
