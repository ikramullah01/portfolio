const { body } = require("express-validator");
const User = require("../models/user");

const userValidation = () => {
  return [
    body("name").trim().notEmpty().isLength({ min: 3 }),
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
    body("number", "Required with minimum length of 7 characters")
      .trim()
      .notEmpty()
      .isLength({ min: 7 }),
    body("address", "Required with minimum length of 5 characters")
      .trim()
      .notEmpty()
      .isLength({ min: 5 }),
    body("occupation", "Required with minimum length of 5 characters")
      .trim()
      .notEmpty()
      .isLength({ min: 5 }),
    body("about_me", "Required with minimum length of 5 characters")
      .trim()
      .notEmpty()
      .isLength({ min: 5 }),
  ];
};

module.exports = userValidation;
