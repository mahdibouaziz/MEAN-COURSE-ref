const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "assets", "images"));
  },
  filename: (req, file, cb) => {
    let fileExt;
    if (file.mimetype === "image/png") {
      fileExt = ".png";
    } else {
      fileExt = ".jpg";
    }
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + file.originalname + fileExt
    );
  },
});

const fileFilter = (req, file, cb) => {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  // To reject this file pass `false`, like so: cb(null, false);
  // To accept the file pass `true`, like so: cb(null, true);
  // You can always pass an error if something goes wrong: cb(new Error("I don't have a clue!"));
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage, fileFilter }).single("image"));

//Serving static images
app.use("/images", express.static(path.join(__dirname, "assets", "images")));

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
