// const { connection } = require("../DB/connectionDB.js");

import { connection } from "../DB/connectionDB.js";

export const EmailExist = (req, res, next) => {
  const { email } = req.body;
  const query = "select * from users where u_email=?";
  connection.execute(query, [email], (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error on query", err });
    }
    console.log(result);

    if (result.length > 0) {
      return res.status(409).json({ message: "email already exist" });
    }
    next();
  });
};

// module.exports = EmailExist;
