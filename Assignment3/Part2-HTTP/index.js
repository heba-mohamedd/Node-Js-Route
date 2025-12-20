const fs = require("node:fs");
const http = require("node:http");
const { resolve } = require("node:path");
const readFileStream = fs.createReadStream("./data.json");
const port = 3000;
const server = http.createServer((req, res) => {
  const { url, method } = req;

  console.log({ method: method, url: url });
  if (method === "GET" && url === "/user") {
    fs.readFile(resolve("./data.json"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Read file error" }));
      }
      res.writeHead(200, "Ok", { "content-type": "application/json" });
      let users = JSON.parse(data).users;
      return res.end(
        JSON.stringify({
          success: true,
          users,
        })
      );
    });
  } else if (method === "POST" && url === "/user") {
    let newUser = "";
    req.on("data", (chunk) => {
      newUser += chunk;
    });
    req.on("end", () => {
      const { id, email, name, age } = JSON.parse(newUser);

      fs.readFile(resolve("./data.json"), (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ message: "Read file error" }));
        }
        let users = JSON.parse(data).users;
        let existUser = users.find(
          (user) => user.email == email || user.id == id
        );

        if (existUser) {
          res.writeHead(400, "error", {
            "content-type": "application/json",
          });
          res.write(JSON.stringify({ message: "Email or ID already exists " }));
          return res.end();
        }

        users.push({ id, email, name, age });
        fs.writeFile("./data.json", JSON.stringify({ users: users }), (err) => {
          if (err) {
            res.writeHead(400, "error", {
              "content-type": "application/json",
            });
            res.write(JSON.stringify({ message: "Error during add user" }));
            return res.end();
          }
          res.writeHead(201, "Created", { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              success: "true",
              message: "User created successfully",
            })
          );
        });
      });
    });
  } else if (method === "PATCH" && url.startsWith("/user/")) {
    const id = url.split("/")[2];
    let newDataOfUser = "";
    req.on("data", (chunk) => {
      newDataOfUser += chunk;
    });
    req.on("end", () => {
      const body = JSON.parse(newDataOfUser);

      fs.readFile(resolve("./data.json"), (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ message: "Read file error" }));
        }
        let users = JSON.parse(data).users; //get All users
        let existUser = users.find((user) => user.id == id);
        if (!existUser) {
          res.writeHead(404, "Not Found", {
            "content-type": "application/json",
          });
          res.write(JSON.stringify({ message: "User ID Not Found" }));
          return res.end();
        }

        users = users.map((user) =>
          user.id == id ? { ...user, ...body } : user
        );
        fs.writeFile("./data.json", JSON.stringify({ users: users }), (err) => {
          if (err) {
            res.writeHead(400, "error", {
              "content-type": "application/json",
            });
            res.write(JSON.stringify({ message: "Error during Updata user" }));
            return res.end();
          }
          res.writeHead(200, "Ok", { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              success: "true",
              message: "User Updatad successfully",
            })
          );
        });
      });
    });
  } else if (method === "GET" && url.startsWith("/user/")) {
    const id = url.split("/")[2];
    fs.readFile(resolve("./data.json"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Read file error" }));
      }
      let users = JSON.parse(data).users; //get All users
      let existUser = users.find((user) => user.id == id);
      if (!existUser) {
        res.writeHead(404, "Not Found", {
          "content-type": "application/json",
        });
        res.write(JSON.stringify({ message: "User ID Not Found" }));
        return res.end();
      }
      res.writeHead(200, "Ok", { "content-type": "application/json" });
      return res.end(JSON.stringify(existUser));
    });
  } else if (method === "DELETE" && url.startsWith("/user/")) {
    const id = url.split("/")[2];
    // console.log(id);
    fs.readFile(resolve("./data.json"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Read file error" }));
      }
      let users = JSON.parse(data).users; //get All users
      let userIndex = users.findIndex((user) => {
        return user.id == id;
      });
      if (userIndex == -1) {
        res.writeHead(404, "Not Found", {
          "content-type": "application/json",
        });
        res.write(JSON.stringify({ message: "User ID Not Found" }));
        return res.end();
      }
      users.splice(userIndex, 1); // splice updata in new data
      fs.writeFile("./data.json", JSON.stringify({ users: users }), (err) => {
        if (err) {
          res.writeHead(400, "error", {
            "content-type": "application/json",
          });
          res.write(JSON.stringify({ message: "Error during Delete user" }));
          return res.end();
        }
        res.writeHead(200, "Ok", { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            success: "true",
            message: "User Deleted successfully",
          })
        );
      });
    });
  } else {
    res.writeHead(404, "error", { "content-type": "application/json" });
    res.write(JSON.stringify({ message: "404 Page not Found" }));
    return res.end();
  }
});

server.listen(3000, () => {
  console.log(`Server is Running on port number ${port}`);
});

server.on("close", () => {
  console.log("Server is Close");
  fs.writeFileSync(
    resolve("./log.txt"),
    `\nServer is close at ${new Date()} `,
    { flag: "a" }
  );
});
server.on("error", (err) => {
  if (err.code == "EADDRINUSE") {
    server.close();
  } else console.log(err);
});
