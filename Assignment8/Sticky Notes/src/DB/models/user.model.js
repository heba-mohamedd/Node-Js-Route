import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, min: 18, max: 60 },
  },
  {
    strictQuery: true,
    optimisticConcurrency: true,
  },
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
