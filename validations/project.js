const { body } = require("express-validator");

const projectValidation = () => {
  return [
    body("title", "Title should be atleast 3 characters")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("description", "Should be between 20 to 500 characters")
      .trim()
      .notEmpty()
      .isLength({ min: 20, max: 500 }),
    body("start_date", "start date is required").trim().notEmpty(),
  ];
};

module.exports = projectValidation;
