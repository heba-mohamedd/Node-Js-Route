// const mysql = require("mysql2");
import mysql from "mysql2";
export const connection = mysql.createConnection({
  host: "127.0.0.1",
  database: "blog-app",
  user: "root",
  password: "root",
});

export const checkConnectionDB = () => {
  connection.connect((err) => {
    if (err) {
      console.log({ err });
    } else {
      console.log("DB Connected Successfully .......");
    }
  });
};
// module.exports = { connection, checkConnectionDB };
