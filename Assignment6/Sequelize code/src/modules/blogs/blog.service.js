// const { connection } = require("../../DB/connectionDB.js");

import { connection } from "../../DB/connectionDB.js";

export const createBlog = (req, res, next) => {
  const { userId, title, description } = req.body;

  const query =
    "insert into blogs(b_title , b_description , user_id) values(?,?,?)";
  connection.execute(
    query,
    [title, description, userId],
    (err, resultOfCreateBlogs) => {
      if (err) {
        return res.status(400).json({ message: "error on query", err });
      }
      resultOfCreateBlogs.affectedRows > 0
        ? res.status(201).json({ message: "blogs is created" })
        : res.status(301).json({ message: "error during create " });
    }
  );
};

export const getBlogs = (req, res, next) => {
  const query = "select * from blogs";
  connection.execute(query, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error on selected query", err });
    }

    return res.status(200).json({ message: "done", blogs: result });
  });
};

// module.exports = { createBlog, getBlogs };
