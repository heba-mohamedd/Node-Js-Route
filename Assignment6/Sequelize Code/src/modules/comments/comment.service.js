import { Model, Op } from "sequelize";
import commentModel from "../../DB/models/comment.model.js";
import userModel from "../../DB/models/user.model.js";
import postModel from "../../DB/models/post.model.js";

export const createComments = async (req, res, next) => {
  try {
    const comments = await commentModel.bulkCreate(req.body);

    return res.status(201).json({ message: "Comments Created" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Operation failed", error: error.message });
  }
};

export const updataComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const { userId, content } = req.body;
    console.log({ commentId, userId, content });

    const comment = await commentModel.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment Not found" });
    }
    if (comment?.userId !== userId) {
      return res.status(403).json({
        message:
          "Unauthorized: You are not  Unauthorized to updata this Comment",
      });
    }
    const updatedComment = await commentModel.update(
      { userId, content },
      {
        where: {
          id: commentId,
        },
      },
    );
    return res.status(200).json({ message: "Comment Updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Operation failed", error: error.message });
  }
};

export const findOrCreateComment = async (req, res, next) => {
  try {
    const { userId, postId, content } = req.body;
    const comment = await commentModel.findOrCreate({
      where: {
        userId,
        postId,
        content,
      },
    });
    return res.status(200).json({ comment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Operation failed", error: error.message });
  }
};

export const findAndCount = async (req, res, next) => {
  try {
    const word = req.query.word;
    const { count, rows } = await commentModel.findAndCountAll({
      where: {
        content: {
          [Op.like]: `%${word}%`,
        },
      },
    });
    if (count === 0) {
      return res.status(404).json({ message: "Comments Not found" });
    }
    return res.status(200).json({ count, comments: rows });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Operation failed", error: error.message });
  }
};

export const getNewsetComments = async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);

    const comments = await commentModel.findAll({
      attributes: ["id", "content", "createdAt"],
      where: {
        postId: postId,
      },
      order: [["createdAt", "DESC"]],
      limit: 3,
    });

    return res.status(200).json({ comments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Operation failed", error: error.message });
  }
};

export const getCommentWithAllInformation = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    console.log(id);

    const comments = await commentModel.findByPk(id, {
      attributes: ["id", "content"],
      include: [
        {
          model: postModel,
          attributes: ["id", "title", "content"],
        },
        {
          model: userModel,
          attributes: ["id", "name", "email"],
        },
      ],
    });
    if (comments === null) {
      return res.status(404).json({ message: "Comment Not found" });
    }

    return res.status(200).json({
      message: "success",
      comment: {
        id: comments.id,
        content: comments.content,
        user: comments.User,
        post: comments.postModel,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Operation failed", error: error.message });
  }
};
