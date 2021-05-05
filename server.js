const express = require("express");
const Joi = require("joi");
var jsonfile = require("jsonfile");
const app = express();
const fs = require("fs");
let rawdata = fs.readFileSync("users.json");
let users = JSON.parse(rawdata);

app.use(express.static("./client"));
app.use(express.json());

// GET all the users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// GET one of the users
app.get("/api/users/:id", (req, res) => {
  const user = getUser(req.params.id);
  if (user.length === 0) {
    res.status(404).send("The user with the given ID was not found.");
    return;
  }
  res.json(user);
});

// POST new user
app.post("/api/users", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    eyeColor: Joi.string().required(),
    age: Joi.number().required(),
  });
  const result = schema.validate(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const data = fs.readFileSync("users.json");
  const userList = JSON.parse(data);

  const nameToSave = req.body.name;
  const eyeColorToSave = req.body.eyeColor;
  const ageToSave = req.body.age;

  let idToSave = 0;
  users.forEach((user) => {
    if (user.id > idToSave) {
      idToSave = user.id;
    }
  });
  idToSave++;

  users.push({
    id: idToSave,
    name: nameToSave,
    eyeColor: eyeColorToSave,
    age: ageToSave,
  });
  res.json({
    status: `New user ${nameToSave} created.`,
  });
  jsonfile.writeFile("users.json", users, { spaces: 2 }, (err) => {
    if (err) throw err;
    res.send();
  });
});

// PUT (update) a user
app.put("/api/users/:id", (req, res) => {
  const rawdata = fs.readFileSync("users.json");
  const users = JSON.parse(rawdata);
  const targetUser = users.findIndex((u) => u.id === parseInt(req.params.id));

  const updatedUser = req.body;
  users[targetUser].name = updatedUser.name;
  users[targetUser].age = updatedUser.age;
  users[targetUser].eyeColor = updatedUser.eyeColor;

  jsonfile.writeFile("users.json", users, { spaces: 2 }, (err) => {
    if (err) throw err;
  });
  res.status(200);
});

// DELETE a user
app.delete("/api/users/:id", (req, res) => {
  const user = getUser(parseInt(req.params.id));
  if (!user) {
    res.status(404).send("The user with the given ID was not found.");
    return;
  } else {
    const index = users.indexOf(user);
    users.splice(index, 1);
    jsonfile.writeFile("users.json", users, { spaces: 2 }, (err) => {
      if (err) throw err;
    });
    res.status(200);
  }
});

function getUser(id) {
  return users.find(function (users) {
    return users.id == id;
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.`));
