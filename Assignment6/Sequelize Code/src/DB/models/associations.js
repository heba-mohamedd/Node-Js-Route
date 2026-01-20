import commentModel from "./comment.model.js";
import postModel from "./post.model.js";
import userModel from "./user.model.js";

// Post Table userId (Foreign Key to Users)
userModel.hasMany(postModel, {
  foreignKey: "userId",
});
postModel.belongsTo(userModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Comment Table userId (Foreign Key to Users)
userModel.hasMany(commentModel, {
  foreignKey: "userId",
});
commentModel.belongsTo(userModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Comment Table postId (Foreign Key to Posts)
postModel.hasMany(commentModel, {
  foreignKey: "postId",
});
commentModel.belongsTo(postModel, {
  foreignKey: "postId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
