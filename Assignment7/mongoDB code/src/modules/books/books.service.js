import { ObjectId } from "mongodb";
import { booksModel } from "../../DB/models/books.model.js";
import { logsModel } from "../../DB/models/logs.model.js";

export const insertBook = async (req, res, next) => {
  try {
    const { title, author, year, genres } = req.body;
    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ message: "Title is required and cannot be empty" });
    }
    if (!author || !author.trim()) {
      return res
        .status(400)
        .json({ message: "Author is required and cannot be empty" });
    }
    if (typeof year !== "number") {
      return res.status(400).json({ message: "Year should be a number" });
    }
    const result = await booksModel.insertOne({
      title,
      author,
      year,
      genres,
    });
    return res.status(201).json({
      message: "Book created successfully",
      acknowledged: result.acknowledged,
      id: result.insertedId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const insertMultipleBooks = async (req, res, next) => {
  try {
    const result = await booksModel.insertMany(req.body);
    return res.status(201).json({
      message: "Books created successfully",
      acknowledged: result.acknowledged,
      id: result.insertedIds,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const updataBook = async (req, res, next) => {
  try {
    const { title } = req.params;
    const { year, author, genres } = req.body;
    console.log(req.body);
    console.log(title);

    let obj = {};
    if (year) obj.year = year;
    if (author) obj.author = author;
    if (genres) obj.genres = genres;

    console.log(title);
    const result = await booksModel.updateOne({ title: title }, { $set: obj });
    return res.status(200).json({
      message: "Book Updated successfully",
      acknowledged: result.acknowledged,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const getBookWithTitle = async (req, res, next) => {
  try {
    const { title } = req.query;
    console.log(title);
    const result = await booksModel.find({ title }).toArray();
    console.log(result);

    return res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const getBooksWithYear = async (req, res, next) => {
  try {
    let { from, to } = req.query; // req.query=====> is string
    // from = Number(from);
    // to = Number(to);
    const result = await booksModel
      .find({ year: { $gte: Number(from), $lte: Number(to) } })
      .toArray();

    return res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const getBookByGenre = async (req, res, next) => {
  try {
    const { genre } = req.query;
    console.log(genre);
    const result = await booksModel
      .find({ genres: { $elemMatch: { $eq: genre } } })
      .toArray();
    console.log(result);

    return res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const getSkipAndLimitBooks = async (req, res, next) => {
  try {
    const result = await booksModel
      .find()
      .sort({ year: -1 })
      .skip(2)
      .limit(3)
      .toArray();

    return res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const getBooksWithYearIsInteger = async (req, res, next) => {
  try {
    const result = await booksModel.find({ year: { $type: "int" } }).toArray();

    return res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const getBooksWithExcludegenres = async (req, res, next) => {
  try {
    const result = await booksModel
      .find({ genres: { $nin: ["Horror", "science fiction"] } })
      .toArray();

    return res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const DeleteAllBooksBeforeYear = async (req, res, next) => {
  try {
    const { year } = req.query;
    const result = await booksModel.deleteMany({ year: { $lt: Number(year) } });

    return res.status(200).json({
      message: "Book Deleted successfully",
      acknowledged: result.acknowledged,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const getFilteredAndSortedBooks = async (req, res, next) => {
  try {
    const result = await booksModel
      .aggregate([{ $match: { year: { $gt: 2000 } } }, { $sort: { year: -1 } }])
      .toArray();

    return res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const getBooksPublishedAfter2000 = async (req, res, next) => {
  try {
    const result = await booksModel
      .aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $project: { title: 1, author: 1, year: 1, _id: 0 } },
      ])
      .toArray();

    return res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const splitGenres = async (req, res, next) => {
  try {
    const result = await booksModel
      .aggregate([
        { $project: { title: 1, genres: 1, _id: 0 } },
        { $unwind: "$genres" },
      ])
      .toArray();

    return res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};

export const getBooksWithLogs = async (req, res, next) => {
  try {
    const result = await logsModel
      .aggregate([
        {
          $lookup: {
            from: "books",
            localField: "book_id",
            foreignField: "_id",
            pipeline: [{ $project: { title: 1, author: 1, year: 1, _id: 0 } }],
            as: "book_details",
          },
        },
        { $project: { _id: 0, action: 1, book_details: 1 } },
      ])
      .toArray();

    return res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Catch error",
      error: error.message,
    });
  }
};
