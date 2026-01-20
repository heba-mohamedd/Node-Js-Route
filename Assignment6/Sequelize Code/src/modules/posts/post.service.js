import postModel from "../../DB/models/post.model.js";
import userModel from "../../DB/models/user.model.js";
import commentModel from "../../DB/models/comment.model.js";
import { fn, col } from "sequelize";

export const createPost = async (req, res, next) => {
  try {
    const { title, content, userId } = req.body;
    const user = await userModel.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or not registered" });
    }

    const post = await postModel.create({ title, content, userId });
    if (post.id) {
      return res
        .status(201)
        .json({ message: "Post Created successfully", post });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

// export const deletePost = async (req, res, next) => {
//   try {
//     const postId = Number(req.params.postId);
//     const { userId } = req.body;
//     const deletedPost = await postModel.destroy({
//       where: { [Op.and]: [{ id: postId }, { userId: userId }] },
//     }); //return number of posts is deleted
//     if (!deletedPost) {
//       const post = await postModel.findByPk(postId);
//       if (post) {
//         return res.status(403).json({
//           message: "Unauthorized: You are not the owner of this post",
//         });
//       }
//       return res.status(404).json({ message: "Post Not found" });
//     }
//     return res.status(200).json({ message: "Post deleted successfully" });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Catch error",
//       error: error.message,
//     });
//   }
// };

export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await postModel.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post Not found" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({
        message: "Unauthorized: You are not the owner of this post",
      });
    }
    await postModel.destroy({ where: { id: postId } });
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const getPostsDetails = async (req, res, next) => {
  try {
    const data = await postModel.findAll({
      attributes: ["id", "title"],
      include: [
        { model: userModel, attributes: ["id", "name"] },
        { model: commentModel, attributes: ["id", "content"] },
      ],
    });
    // const posts = data.map((item) => {
    //   return {
    //     id: item.id,
    //     title: item.title,
    //     users: item.User,
    //     comments: item.commentModels,
    //   };
    // });
    // return res.status(200).json({ posts });

    return res.status(200).json({ message: "success", data });
  } catch (error) {
    // Ideally, pass this to your error handling middleware
    return res.status(500).json({ message: "Error fetching posts", error });
  }
};

// export const getPostsCommentsCount = async (req, res, next) => {
//   const data = await postModel.findAll({
//     attributes: ["id", "title"],
//     include: { model: commentModel },
//   });
//   const posts = data.map((item) => {
//     return {
//       id: item.id,
//       title: item.title,
//       commentCount: item.commentModels.length,
//     };
//   });
//   return res.status(200).json({ posts });
// };

export const getPostsCommentsCount = async (req, res, next) => {
  const posts = await postModel.findAll({
    attributes: [
      "id",
      "title",
      [fn("COUNT", col("commentModels.id")), "commentCount"],
    ],
    include: [
      {
        model: commentModel,
        attributes: [],
      },
    ],
    group: ["postModel.id"],
  });

  res.status(200).json({ posts });
};
