const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { syncError, asyncError } = require("./errors/errors");

const Post = require("./models/post");

const app = express();

const MONGODB_URI =
  "mongodb+srv://mahdi:mahdi123@cluster0.sr2ks.mongodb.net/node-angular?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Problem when connecting to the database");
    console.log(err);
  });

app.use(bodyParser.json());
app.use(cors());

app.get("/api/posts", async (req, res, next) => {
  try {
    const posts = await Post.find({}).exec();
    return res.status(200).json({
      message: "Post fetched succesfully",
      posts,
    });
  } catch (err) {
    asyncError(err, next);
  }
});

app.post("/api/posts", async (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    await post.save();
    return res.status(201).json({ message: "Post created", postId: post._id });
  } catch (err) {
    asyncError(err, next);
  }
});

app.delete("/api/posts/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    await Post.deleteOne({ _id: postId });
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    asyncError(err, next);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message || "";
  return res.status(status).json({ message });
});

module.exports = app;
