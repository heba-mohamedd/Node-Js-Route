import userModel from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const saltRounds = 10;

import Cryptr from "cryptr";
import { Types } from "mongoose";
const cryptr = new Cryptr("myTotallySecretKey", {
  pbkdf2Iterations: 10000,
  saltLength: 10,
});

// const phone = cryptr.decrypt(encryptedPhone);
// const isMatch = await bcrypt.compare(password, hash);

export const SignUp = async (req, res, next) => {
  try {
    const { name, email, password, age, phone } = req.body;

    if (await userModel.findOne({ email })) {
      return res.status(400).json({ message: "Email Already Exist" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const encryptedPhone = cryptr.encrypt(phone);
    await userModel.create({
      name,
      email,
      password: hashedPassword,
      age,
      phone: encryptedPhone,
    });
    return res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const LogIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Password is Not Correct" });
    }
    const token = jwt.sign({ id: user._id }, "secret", {
      expiresIn: "1h",
    });
    return res.status(200).json({ message: "Login Successfull", token });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const UpdataUserInformation = async (req, res, next) => {
  try {
    const id = req.id;

    const { email, name, age } = req.body;

    const user = await userModel.findById({ _id: new Types.ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    if (await userModel.findOne({ email })) {
      return res.status(400).json({ message: "Email Already Exist" });
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      { _id: new Types.ObjectId(id) },
      { email, name, age },
      { new: true, runValidators: true },
    );
    return res.status(200).json({ message: "User Ubdated", updatedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const DeleteUserAcount = async (req, res, next) => {
  try {
    const id = req.id;

    const user = await userModel.findById(id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const x = await userModel.deleteOne({ _id: new Types.ObjectId(id) });
    return res.status(200).json({ message: "User Deleted", x });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const GetLoggedInUserData = async (req, res, next) => {
  try {
    const id = req.id;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};
