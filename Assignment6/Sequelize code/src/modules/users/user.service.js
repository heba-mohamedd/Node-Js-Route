// const { connection } = require("../../DB/connectionDB.js");

import { connection } from "../../DB/connectionDB.js";

export const getAllUsers = (req, res, next) => {
  const query = "select * from users;";
  connection.execute(query, [], (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error on query", err });
    }

    return res.status(200).json({ result });
  });
};

export const signUp = (req, res, next) => {
  const { firstName, lastName, email, password, gender, DOB } = req.body;

  const query =
    "insert into users(u_fname ,u_lname , u_email , u_password , u_gender , u_DOB) values (?,?,?,?,?,?)";
  connection.execute(
    query,
    [firstName, lastName, email, password, gender, DOB],
    (err, insertResult) => {
      if (err) {
        return res.status(400).json({ message: "error on query", err });
      }
      insertResult.affectedRows > 0
        ? res.status(201).json({ message: "created user account" })
        : res.status(301).json({ message: "error during create " });
    }
  );
};

export const signIn = (req, res, next) => {
  const { email, password } = req.body;

  //   const query = "select * from users where u_email=?";
  const query = "SELECT * FROM users WHERE u_email =? AND u_password =?; ";

  connection.execute(query, [email, password], (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error on query", err });
    }
    if (result.length == 0) {
      return res.status(400).json({ message: "email not exist" });
    }
    // if (result[0].u_password != password) {
    //   return res.status(409).json({ message: "password is not correct" });
    // }
    return res
      .status(200)
      .json({ message: "correct email  and password ", result });
  });
};

export const deleteProfile = (req, res, next) => {
  const userId = Number(req.params.userId);
  console.log(id);

  const query = "delete from users where u_id=?";
  connection.execute(query, [userId], (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error on query", err });
    }
    return res.status(202).json({ message: "account deleted Successfully" });
  });
};

export const getProfile = (req, res, next) => {
  const { userId } = req.params;

  //   const query = "select * from users where u_email=?";
  const query = `SELECT 
    CONCAT(u_fname , " ",u_lname ) as userName
    , u_email ,
    TIMESTAMPDIFF(YEAR , u_DOB,CURRENT_DATE())as age 
     FROM users WHERE u_id =?`;

  connection.execute(query, [userId], (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error on query", err });
    }
    if (result.length == 0) {
      return res.status(400).json({ message: "email not exist" });
    }

    return res.status(200).json({ message: "done", user: result[0] });
  });
};

export const updataProfile = (req, res, next) => {
  const { userId } = req.params;

  const { firstName, lastName, password, gender, DOB } = req.body;

  const query = "select * from users where u_id=?";
  connection.execute(query, [userId], (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error on selected query", err });
    }
    if (result.length == 0) {
      return res.status(400).json({ message: "email not exist" });
    }
    const query =
      "UPDATE users SET u_fname=?,u_lname=?,u_password=?,u_gender=?,u_DOB=? WHERE u_id=?";
    connection.execute(
      query,
      [
        firstName ?? result[0].u_fname,
        lastName ?? result[0].u_lname,
        password ?? result[0].u_password,
        gender ?? result[0].u_gender,
        DOB ?? result[0].u_DOB,
        userId,
      ],
      (err, updatedResult) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "error on updated query", err });
        }
        updatedResult.affectedRows > 0
          ? res.status(201).json({ message: "updata data of user" })
          : res.status(201).json({ message: "error during updated " });
      }
    );
  });
};
// module.exports = {
//   getAllUsers,
//   signUp,
//   signIn,
//   deleteProfile,
//   getProfile,
//   updataProfile,
// };
