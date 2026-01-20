import { DataTypes, ENUM } from "sequelize";
import { sequelize } from "../connectionDB.js";

const userModel = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkPasswordLength(value) {
          if (value.length <= 6) {
            throw new Error("Password must be at least 6 characters long");
          }
        },
      },
    },
    role: {
      //   type: ENUM(["user", "admin"]),
      type: DataTypes.ENUM(["user", "admin"]),
      //   type: DataTypes.ENUM(),
      //   values: ["user", "admin"],
      defaultValue: "user",
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async function checkNameLength(user) {
        if (user.name.length <= 2) {
          throw new Error("Name must be at least 2 characters long");
        }
      },
    },
    timestamps: true,
    tableName: "users",
  },
);

export default userModel;
