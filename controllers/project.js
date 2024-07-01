const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const User = require("../models/user");
const Project = require("../models/project");

exports.getUserProjects = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const project = await Project.find({ user: user._id });
    return res.status(200).json({
      user: user,
      project: project,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUserProject = async (req, res, next) => {
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
    const start_date = req.body.start_date;
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

    const project = new Project({
      title: title,
      description: description,
      image: imageUrl,
      start_date: start_date,
      user: userId,
    });
    await project.save();

    res.status(201).json({
      message: "Project entry created successfully!",
      project: project,
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);

    if (!project) {
      const error = new Error("Could not find project.");
      error.statusCode = 404;
      throw error;
    }
    if (project.user.toString() !== req.userId.toString()) {
      const error = new Error("Not Authorized!");
      error.statusCode = 403;
      throw error;
    }
    // clearImage(post.imageUrl);
    await Project.findByIdAndDelete(projectId);

    return res.status(200).json({ message: "Project Deleted successfully." });
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
