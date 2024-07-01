const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const User = require("../models/user");
const Social = require("../models/social");

exports.getUserSocial = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const social = await Social.find({ user: user._id });
    return res.status(200).json({
      user: user,
      social: social,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUserSocial = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.data = errors.array();
      err.statusCode = 422;
      throw err;
    }
    const plateform = req.body.plateform;
    const url = req.body.url;
    const userId = req.userId;
    const social = new Social({
      plateform: plateform,
      url: url,
      user: userId,
    });
    await social.save();

    res.status(201).json({
      message: "Social entry created successfully!",
      social: social,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteSocial = async (req, res, next) => {
  try {
    const socialId = req.params.socialId;
    const social = await Social.findById(socialId);

    if (!social) {
      const error = new Error("Could not find social.");
      error.statusCode = 404;
      throw error;
    }
    if (social.user.toString() !== req.userId.toString()) {
      const error = new Error("Not Authorized!");
      error.statusCode = 403;
      throw error;
    }
    // clearImage(post.imageUrl);
    await Social.findByIdAndDelete(socialId);

    return res.status(200).json({ message: "Social Deleted successfully." });
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
