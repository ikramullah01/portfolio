const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error("User not found.");
      err.statusCode = 404;
      throw err;
    }
    return res.status(200).json({
      user: user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.data = errors.array();
      err.statusCode = 422;
      throw err;
    }
    // if (!req.file) {
    //   const err = new Error("No image provided.");
    //   err.statusCode = 422;
    //   throw err;
    // }
    const name = req.body.name;
    const email = req.body.email;
    const number = req.body.number;
    const address = req.body.address;
    const occupation = req.body.occupation;
    const about_me = req.body.about_me;
    let imageUrl = undefined;
    if (req.file) {
      imageUrl = req.file.path.replace("\\", "/");
    }
    if (!imageUrl) {
      const err = new Error("Image is not uploaded.");
      err.statusCode = 422;
      throw err;
    }

    const user = new User({
      name: name,
      email: email,
      number: number,
      address: address,
      occupation: occupation,
      about_me: about_me,
      image: imageUrl,
    });
    await user.save();

    res.status(201).json({
      message: "User created successfully!",
      user: user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
