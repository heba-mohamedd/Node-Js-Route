import userModel from "../../DB/models/user.model.js";

export const signUp = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const users = await userModel.findOne({
    where: {
      email: email,
    },
  });
  if (users) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const user = await userModel.create({ name, email, password, role });

  if (user.id) {
    return res.status(201).json({ message: "User added successfully", user });
  }
};

export const updataOrCreateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const { name, email, password, role } = req.body;
    // const user = await userModel.findByPk(id);
    // if (user) {
    //   const updateData = {};
    //   if (name) updateData.name = name;
    //   if (email) updateData.email = email;
    //   if (password) updateData.password = password;
    //   if (role) updateData.role = role;
    //   await userModel.update(updateData, {
    //     where: { id: id },
    //     validate: false,
    //   });
    // } else {
    //   await userModel.create(
    //     { id, name, email, password, role },
    //     { validate: false },
    //   );
    // }
    const userData = { id, ...req.body };
    await userModel.upsert(userData, { validate: false, hooks: false });
    return res
      .status(201)
      .json({ message: "User Created or Updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Operation failed", error: error.message });
  }
};

export const getUserByEmail = async (req, res, next) => {
  const email = req.query.email;
  const user = await userModel.findOne({ where: { email: email } });
  if (user === null) {
    return res.status(404).json({ message: "no user found" });
  }
  return res.status(200).json({ user });
};

export const getUserByPK = async (req, res, next) => {
  const id = Number(req.params.id);
  const user = await userModel.findByPk(id, {
    attributes: { exclude: ["role"] },
  });
  if (user === null) {
    return res.status(404).json({ message: "no user found" });
  }
  return res.status(200).json({ user });
};
