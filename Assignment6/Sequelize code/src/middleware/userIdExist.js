// const { connection } = require("../DB/connectionDB.js");

import { connection } from "../DB/connectionDB.js";

export const UserIdExist = (req, res, next) => {
  const userId = req.params.userId || req.body.userId;
  const query = "select * from users where u_id=?";
  connection.execute(query, [userId], (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error on selected query", err });
    }
    if (result.length == 0) {
      return res.status(400).json({ message: "email not exist" });
    }
    next();
  });
};

// module.exports = UserIdExist;
