const express = require("express");
const { readFileSync, writeFileSync } = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");

const app = express();
const Port = 3000;

const userPath = path.resolve("./DB/users.json");
let users = JSON.parse(readFileSync(userPath), { encoding: "utf-8" });
const notesPath = path.resolve("./DB/notes.json");
const notes = JSON.parse(readFileSync(notesPath), { encoding: "utf-8" });
app.use(express.json());

// !----------- USERS --------------------------
// # create
app.post("/user/signUp", (req, res, next) => {
  const { name, age, email } = req.body;
  const isEmailExists = users.find((user) => user.email === email);

  if (isEmailExists) {
    return res.status(409).json({ message: "email already exist" });
  } else {
    let user = {
      name,
      age,
      email,
      id: nanoid(),
    };
    users.push(user);
    writeFileSync(userPath, JSON.stringify(users, null, 2));
    return res.status(201).json({ message: "created", user });
  }
});

// # update
app.patch("/user/:id", (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const isUser = users.find((user) => user.id === id);
  if (isUser) {
    users.map((user) => {
      if (user.id === id) {
        user.name = name;
      }
    });
    writeFileSync(userPath, JSON.stringify(users, null, 2));
    res
      .status(201)
      .json({ message: "updated", users: users[users.length - 1] });
  } else {
    res.status(404).json({ message: "user not found" });
  }
});

// # delete
app.delete("/user{/:id}", (req, res, next) => {
  const { id } = req.params;

  const isUser = users.find((user) => user.id === id);
  if (isUser) {
    users = users.filter((user) => user.id !== id);
    writeFileSync(userPath, JSON.stringify(users, null, 2));

    res.status(200).json({ message: "deleted", users: users });
  } else {
    res.status(404).json({ message: "user not found" });
  }
});

// # getByName
app.get("/user/getByName", (req, res, next) => {
  const { name } = req.query;
  const user = users.find((user) => user.name === name);
  if (user) {
    return res.json({ message: "Done", user });
  }
  res.json({ message: "user name not found" });
});

//# getAllUsers
app.get("/user", (req, res, next) => {
  res.json({ message: "Users", users });
});
// # filters users by minimum age

app.get("/user/filter", (req, res, next) => {
  const { minAge } = req.query;

  const usersFiltered = users.filter((user) => user.age <= Number(minAge));
  if (usersFiltered.length > 0) {
    return res.json({ message: "Done", users: usersFiltered });
  }
  res.json({ message: " not found" });
});

// # gets User by ID
app.get("/user/:id", (req, res, next) => {
  const { id } = req.params;

  const isUser = users.find((user) => user.id === id);

  isUser
    ? res.status(200).json({ message: "done", users: isUser })
    : res.status(404).json({ message: "user not found" });
});
app.listen(Port, () => {
  console.log(`server is running on ${Port}`);
});
