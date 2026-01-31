import { ObjectId } from "mongodb";
import { logsModel } from "../../DB/models/logs.model.js";

export const insertLogs = async (req, res, next) => {
  try {
    const { book_id, action } = req.body;
    if (!book_id | !book_id.trim()) {
      return res
        .status(400)
        .json({ message: "book_id is required and cannot be empty" });
    }
    if (!action | !action.trim()) {
      return res
        .status(400)
        .json({ message: "action is required and cannot be empty" });
    }
    const result = await logsModel.insertOne({
      book_id: new ObjectId(book_id),
      action,
    });
    return res.status(201).json({
      message: "Log created successfully",
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};
