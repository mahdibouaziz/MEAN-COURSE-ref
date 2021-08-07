const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/api/posts", (req, res, next) => {
  // get the posts from the DB
  const posts = [
    { id: "1234", title: "title", content: "this is a content" },
    { id: "1235", title: "title", content: "this is a content" },
  ];

  return res.status(200).json({
    message: "Post fetched succesfully",
    posts,
  });
});

app.post("/api/posts", (req, res, next) => {
  post = req.body;
  console.log(post);
  // Save the post to the database
  return res.status(201).json({ message: "Post created" });
});

module.exports = app;
