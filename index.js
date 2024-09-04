const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./users");
require("dotenv").config();
//not quite =>
// function getData(startIndex, endIndex) {
//   var result = [];
//   for (i = startIndex; i <= endIndex; i++) {
//     result.push(users[i]);
//   }
//   return result;
// }

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.once("open", async () => {
  if (await (User.countDocuments().exec() > 0)) return; // exec returns a promise
  //if there's data in db , it gets out of the function

  Promise.all([
    User.create({ name: "User 1" }),
    User.create({ name: "User 2" }),
    User.create({ name: "User 3" }),
    User.create({ name: "User 4" }),
    User.create({ name: "User 5" }),
    User.create({ name: "User 6" }),
    User.create({ name: "User 7" }),
    User.create({ name: "User 8" }),
    User.create({ name: "User 9" }),
  ]).then(() => console.log("Added Users"));
});

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit; // 0 5 2 * 5 = 10
    const endIndex = page * limit; // 3*5 = 15

    const results = {};

    if (endIndex < model.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.prev = {
        page: page - 1,
        limit: limit,
      };
    }

    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}

// app.get("/posts", paginatedResults(Post), (req, res) => {
//   res.json(res.paginatedResults);
// });

app.get("/users", paginatedResults(User), (req, res) => {
  res.json(res.paginatedResults);
  //   res.json(getData(startIndex, endIndex));
});

app.listen(3000);
