const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const User = require("../models/user");
const Service = require("../models/service");

exports.getUserServices = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const service = await Service.find({ user: user._id });
    return res.status(200).json({
      user: user,
      service: service,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUserService = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.data = errors.array();
      err.statusCode = 422;
      throw err;
    }
    const title = req.body.title;
    const description = req.body.description;
    const userId = req.userId;
    let imageUrl = undefined;
    if (req.file) {
      imageUrl = req.file.path.replace("\\", "/");
    }
    if (!imageUrl) {
      const err = new Error("Image is not uploaded.");
      err.statusCode = 422;
      throw err;
    }

    const service = new Service({
      title: title,
      description: description,
      image: imageUrl,
      user: userId,
    });
    await service.save();

    res.status(201).json({
      message: "Service entry created successfully!",
      service: service,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    const serviceId = req.params.serviceId;
    const service = await Service.findById(serviceId);

    if (!service) {
      const error = new Error("Could not find service.");
      error.statusCode = 404;
      throw error;
    }
    if (service.user.toString() !== req.userId.toString()) {
      const error = new Error("Not Authorized!");
      error.statusCode = 403;
      throw error;
    }
    // clearImage(post.imageUrl);
    await Service.findByIdAndDelete(serviceId);

    return res.status(200).json({ message: "Service Deleted successfully." });
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
