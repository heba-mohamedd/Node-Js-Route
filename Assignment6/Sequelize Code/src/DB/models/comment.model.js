import { Model } from "sequelize";
import { DataTypes } from "sequelize";
import { sequelize } from "./../connectionDB.js";

class commentModel extends Model {}

commentModel.init(
  {
    content: { type: DataTypes.TEXT, allowNull: false },
    postId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    timestamps: true,
    tableName: "comments",
  },
);

export default commentModel;
