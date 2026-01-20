import { DataTypes, Model } from "sequelize";
import { sequelize } from "./../connectionDB.js";

class postModel extends Model {}
postModel.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    paranoid: true,
    tableName: "posts",
    timestamps: true,
    sequelize,
  },
);

export default postModel;
