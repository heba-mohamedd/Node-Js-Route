import jwt from "jsonwebtoken";
import userModel from "../DB/models/user.model.js";

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, "secret");

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    req.id = user._id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
