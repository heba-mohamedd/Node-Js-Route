import { Router } from "express";
import * as PS from "./post.service.js";

const postRouter = Router();

postRouter.post("/", PS.createPost);
postRouter.delete("/:postId", PS.deletePost);
postRouter.get("/details", PS.getPostsDetails);
postRouter.get("/comment-count", PS.getPostsCommentsCount);

export default postRouter;
