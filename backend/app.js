const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRouter = require("./routes/post");

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

app.use("/api/posts", postRouter);

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message || "";
  return res.status(status).json({ message });
});

module.exports = app;
