import { Types } from "mongoose";
import noteModel from "../../DB/models/note.model.js";
import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";

export const CreateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const id = req.id;

    await noteModel.create({
      title,
      content,
      userId: id,
    });

    return res.status(201).json({ message: "Note Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const UpdataNote = async (req, res, next) => {
  try {
    // const { token } = req.headers; //Token from Header
    // const { id } = jwt.verify(token, "secret"); //Owner Id  ===>  UserID
    const id = req.id;
    const { noteId } = req.params; //note ID
    const { title, content } = req.body;
    const note = await noteModel.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not Found" });
    }
    if (note.userId.toString() !== id.toString()) {
      return res.status(404).json({ message: "You are Not The Owner" });
    }
    const updataNote = await noteModel.findByIdAndUpdate(
      {
        _id: new Types.ObjectId(noteId),
      },
      { title, content },
      { new: true, runValidators: true },
    );

    return res.status(200).json({ message: "updated", note: updataNote });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const UpdataTitleOfAllNotes = async (req, res, next) => {
  try {
    // const { token } = req.headers;
    // const { id } = jwt.verify(token, "secret");
    const { title } = req.body;
    const id = req.id;
    const note = await noteModel.updateMany(
      { userId: new Types.ObjectId(id) },
      { title },
      { runValidators: true },
    );
    if (note.matchedCount === 0) {
      return res.status(404).json({ message: "No Note Found" });
    }
    return res.status(200).json({ message: "All Notes Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};
export const ReplaceNote = async (req, res, next) => {
  try {
    // const { token } = req.headers;
    // const { id } = jwt.verify(token, "secret");
    const { title, content } = req.body;
    const { noteId } = req.params;
    const id = req.id;
    const note = await noteModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not Found" });
    }
    if (note.userId.toString() !== id.toString()) {
      return res.status(404).json({ message: "You are Not The Owner" });
    }
    const noteReplaced = await noteModel.findOneAndReplace(
      { _id: new Types.ObjectId(noteId) },
      { title, content, userId: new Types.ObjectId(id) },
      { runValidators: true, new: true },
    );

    return res.status(200).json({ message: "All Notes Updated", noteReplaced });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const DeleteSingleNote = async (req, res, next) => {
  try {
    // const { token } = req.headers; //Token from Header
    // const { id } = jwt.verify(token, "secret"); //Owner Id  ===>  UserID
    const id = req.id;
    const { noteId } = req.params; //note ID

    const note = await noteModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not Found" });
    }
    if (note.userId.toString() !== id.toString()) {
      return res.status(404).json({ message: "You are Not The Owner" });
    }
    const DeleteNote = await noteModel.findByIdAndDelete(
      {
        _id: new Types.ObjectId(noteId),
      },

      { new: true },
    );
    return res.status(200).json({ message: "Deleted", note: DeleteNote });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const GetPaginateNotes = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const id = req.id;
    // one page have 3 note
    // page 1 heva first 3 notes and skip 0 >> page 2 have 3 notes and skip 3
    let skip = (page - 1) * limit;
    const notes = await noteModel
      .find({ userId: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({ message: notes });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const GetNoteById = async (req, res, next) => {
  try {
    const id = req.id;
    const { noteId } = req.params;
    const note = await noteModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not Found" });
    }
    if (note.userId.toString() !== id.toString()) {
      return res.status(404).json({ message: "You are Not The Owner" });
    }
    return res.status(200).json({ note });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const GetNoteByContent = async (req, res, next) => {
  try {
    const id = req.id;
    const { content } = req.query;
    const notes = await noteModel.find({
      userId: new Types.ObjectId(id),
      content,
    });
    if (notes.length === 0) {
      return res.status(404).json({ message: "Note not Found" });
    }

    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const GetAllNotesWithUserInformation = async (req, res, next) => {
  try {
    const id = req.id;

    const notes = await noteModel
      .find(
        {
          userId: new Types.ObjectId(id),
        },

        { title: 1, createdAt: 1 },
      )
      .populate("userId", "email -_id");

    if (notes.length === 0) {
      return res.status(404).json({ message: "Note not Found" });
    }

    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const GetAllNotesByAggregation = async (req, res, next) => {
  try {
    const id = req.id;
    const { title } = req.query;
    const obj = { userId: new Types.ObjectId(id) };
    if (title) {
      obj.title = title;
    }

    const notes = await noteModel.aggregate([
      {
        // $match: { userId: new Types.ObjectId(id) },
        $match: obj,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          title: 1,
          content: 1,
          createdAt: 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]);

    if (notes.length === 0) {
      return res.status(404).json({ message: "Note not Found" });
    }

    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};

export const DeleteAllNoteForUser = async (req, res, next) => {
  try {
    const id = req.id;
    const notesDeleted = await noteModel.deleteMany({
      userId: new Types.ObjectId(id),
    });
    return res.status(200).json({ notesDeleted });
  } catch (error) {
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};
