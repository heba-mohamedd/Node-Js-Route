const express = require("express");
const path = require("node:path");
const fs = require("node:fs");

const app = express();
const port = 3000;
function validateUserData(name, email, age, isUpdate = false) {
  errors = [];

  if (!isUpdate) {
    if (name === undefined) {
      errors.push("Name is required");
    }
    if (email === undefined) {
      errors.push("Email is required");
    }
    if (age === undefined || age === null) {
      errors.push("Age is required");
    }
  }

  if (name !== undefined) {
    if (name.trim() === "") {
      errors.push("Name cannot be empty");
    }
  }

  if (email !== undefined) {
    const trimmedEmail = email.trim();
    if (trimmedEmail === "") {
      errors.push("Email cannot be empty");
    } else if (!trimmedEmail.includes("@")) {
      errors.push('Email must contain "@" symbol');
    }
  }

  if (age !== undefined && age !== null) {
    if (typeof age !== "number" || isNaN(age)) {
      errors.push("Age must be a valid number");
    } else if (age < 0) {
      errors.push("Age must be a non-negative number");
    }
  }

  return errors;
}

const absolutePath = path.resolve("./users.json");
// console.log(absolutePath);
if (!fs.existsSync(absolutePath)) {
  fs.writeFileSync(absolutePath, [], { encoding: "utf-8" });
}

function readUser(filePath) {
  try {
    let data = fs.readFileSync(filePath, { encoding: "utf-8" });
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
}

function writeUser(data) {
  try {
    fs.writeFileSync(absolutePath, JSON.stringify(data), {
      encoding: "utf-8",
    });
  } catch (error) {
    console.error("Error writeing users file:", error);
  }
}

app.use(express.json());

// 1. Create an API that adds a new user to your users stored in a JSON file. (ensure that the email of the new user doesn’t exist before)
app.post(
  "/user",
  (req, res, next) => {
    let { email, name, age } = req.body;
    const errors = validateUserData(name, email, age);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    next();
  },
  (req, res, next) => {
    try {
      let { email, name, age } = req.body;
      let users = readUser(absolutePath);
      if (name) name = name.trim();
      if (email) email = email.trim().toLowerCase();
      let newUser = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        email,
        name,
        age,
      };
      let userExist = users.find((item) => item.email === newUser.email);
      if (userExist) {
        return res.status(409).json({ error: "Email already exists" });
      }
      users.push(newUser);
      writeUser(users);
      return res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      return res.status(400).json({ error: "Invalid user data" });
    }
  }
);

// 2. Create an API that updates an existing user's name, age, or email by their ID. The user ID should be retrieved from the params.
app.patch(
  "/user/:id",
  (req, res, next) => {
    let { email, name, age } = req.body;
    const errors = validateUserData(name, email, age, true);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    next();
  },
  (req, res, next) => {
    try {
      let users = readUser(absolutePath);
      let updatas = req.body;
      let id = Number(req.params.id); //string

      let userIndex = users.findIndex((item) => item.id === id);
      if (userIndex == -1) {
        return res.status(404).json({ error: "User ID not found" });
      }
      if (updatas.name) users[userIndex].name = updatas.name;
      if (updatas.age) users[userIndex].age = updatas.age;
      if (updatas.email) {
        let isEmailExist = users.some(
          (item) => item.email === updatas.email && item.id !== id
        );
        if (isEmailExist) {
          return res.status(409).json({ error: "Email already exists" });
        }
        users[userIndex].email = updatas.email;
      }
      writeUser(users);
      return res
        .status(200)
        .json({ message: "User updated successfully", user: users[userIndex] });
    } catch (error) {
      return res.status(400).json({ error: "Invalid user data" });
    }
  }
);

//3. Create an API that deletes a User by ID. The user id should be retrieved from either the request body or optional params.
app.delete("/user/:id", (req, res, next) => {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "Invalid user ID, Id must be a number" });
    }
    let users = readUser(absolutePath);
    let userIndex = users.findIndex((item) => item.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User ID not found" });
    }

    // users = users.filter((user) => user.id !== id);
    users.splice(userIndex, 1);
    writeUser(users);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(400).json({ error: "Invalid user data" });
  }
});

//4. Create an API that gets a user by their name. The name will be provided as a query parameter.
app.get("/user/getByName", (req, res, next) => {
  try {
    let users = readUser(absolutePath);
    let name = req.query.name;
    console.log({ users, name });

    let filteredByName = users.filter((item) => item.name === name);
    return res
      .status(200)
      .json({ count: filteredByName.length, users: filteredByName });
  } catch (error) {
    return res.status(400).json({ error: "Internal Server Error" });
  }
});

// 5. Create an API that gets all users from the JSON file.
app.get("/user", (req, res, next) => {
  try {
    let users = readUser(absolutePath);
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    return res.status(400).json({ error: "Internal Server Error" });
  }
});

// 6. Create an API that filters users by minimum age.
app.get("/user/filter", (req, res, next) => {
  try {
    let users = readUser(absolutePath);
    let minAge = Number(req.query.age);
    if (isNaN(minAge)) {
      return res
        .status(400)
        .json({ error: "Please provide a valid number for age" });
    }
    let filteredUsers = users.filter((user) => user.age >= minAge);
    return res
      .status(200)
      .json({ count: filteredUsers.length, users: filteredUsers });
  } catch (error) {
    return res.status(400).json({ error: "Internal Server Error" });
  }
});

//7. Create an API that gets User by ID.
app.get("/user/:id", (req, res, next) => {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "Invalid user ID, Id must be a number" });
    }
    let users = readUser(absolutePath);
    let existUser = users.find((user) => user.id === id);
    if (!existUser) {
      return res.status(404).json({ error: "User ID not found" });
    }
    return res.status(200).json({ User: existUser });
  } catch (error) {
    return res.status(400).json({ error: "Internal Server Error" });
  }
});

app.use("{/*demo}", (req, res, next) => {
  res.status(404).json({ message: "404 Page Not Found" });
});

app.listen(port, () => {
  console.log(`Server is Running on port number ${port}`);
});
