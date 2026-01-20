import userModel from "../DB/models/user.model.js";

export const signupValidation = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name) return res.status(406).json({ message: "Name is required" });
  if (!email) return res.status(406).json({ message: "Email is required" });
  if (!password)
    return res.status(406).json({ message: "password is required" });
  const users = await userModel.findAll({
    where: {
      email: email,
    },
  });
  if (users.length > 0) {
    return res.status(409).json({ message: "Email already exists" });
  }
  next();
};
