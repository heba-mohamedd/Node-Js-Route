import mongoose, { Types } from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      //   lowercase: true,
      validate: {
        validator: function (v) {
          // If the word is written entirely in uppercase letters, it will be rejected,
          // while normal camelCase or mixed-case titles are allowed.
          //  return v !== v.toUpperCase;
          return !/[A-Z]/.test(v);
        },
        message: (props) =>
          `(${props.value}) Title should not be entirely uppercase`,
      },
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true, strictQuery: true },
);

const noteModel = mongoose.models.note || mongoose.model("note", noteSchema);

export default noteModel;
