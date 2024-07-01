const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const crypto = require("crypto");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const socialRoutes = require("./routes/social");
const projectRoutes = require("./routes/project");
const serviceRoutes = require("./routes/service");

const app = express();
dotenv.config();

const MONGODB_URI = process.env.MONGO_DB;
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, crypto.randomUUID() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  }
  {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", socialRoutes);
app.use("/api", projectRoutes);
app.use("/api", serviceRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  return res
    .status(statusCode)
    .json({ message: message, data: data, statusCode: statusCode });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT);
    console.log(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
