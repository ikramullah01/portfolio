const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const User = require("../models/user");
const Social = require("../models/social");
const Project = require("../models/project");
const Service = require("../models/service");

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
    // const imageUrl = req.file.path.replace("\\", "/");
    const user = new User({
      name: name,
      email: email,
      number: number,
      address: address,
      occupation: occupation,
      about_me: about_me,
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

    const project = new Project({
      title: title,
      description: description,
      start_date: start_date,
      user: userId,
    });
    await project.save();

    res.status(201).json({
      message: "Project entry created successfully!",
      project: project,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

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

    const service = new Service({
      title: title,
      description: description,
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

// exports.updatePost = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const err = new Error("Validation failed, entered data is incorrect.");
//       err.statusCode = 422;
//       throw err;
//     }

//     const postId = req.params.postId;
//     const title = req.body.title;
//     const content = req.body.content;
//     let imageUrl = req.body.image;
//     if (req.file) {
//       imageUrl = req.file.path.replace("\\", "/");
//     }
//     if (!imageUrl) {
//       const err = new Error("Image is not uploaded.");
//       err.statusCode = 422;
//       throw err;
//     }

//     const post = await Post.findById(postId).populate("creator");

//     if (!post) {
//       const error = new Error("Could not find post.");
//       error.statusCode = 404;
//       throw error;
//     }
//     if (post.creator._id.toString() !== req.userId) {
//       const error = new Error("Not Authorized!");
//       error.statusCode = 403;
//       throw error;
//     }
//     if (post.imageUrl !== imageUrl) {
//       clearImage(post.imageUrl);
//     }
//     post.title = title;
//     post.imageUrl = imageUrl;
//     post.content = content;
//     await post.save();
//     io.getIO().emit("posts", {
//       action: "update",
//       post: post,
//     });
//     res.status(200).json({
//       post: post,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
