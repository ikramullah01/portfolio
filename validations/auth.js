const { body } = require("express-validator");
const User = require("../models/user");

const authValidation = () => {
  return [
    body("email", "Please enter a valid email")
      .trim()
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().notEmpty().isLength({ min: 5 }),
    body("name").trim().notEmpty(),
  ];
};

module.exports = authValidation;
