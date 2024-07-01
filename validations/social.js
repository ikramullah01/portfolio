const { body } = require("express-validator");
const Social = require("../models/social");

const socialValidation = () => {
  return [
    body("plateform", "Should be atleast 3 characters")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .custom((value, { req }) => {
        return Social.findOne({ plateform: value }).then((socialDoc) => {
          if (socialDoc) {
            return Promise.reject("This plateform already exists");
          }
        });
      }),
    body("url", "Please enter a valid URL")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .isURL(),
  ];
};

module.exports = socialValidation;
