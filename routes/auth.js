const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const authValidation = require("../validations/auth");

router.put("/signup", [authValidation()], authController.signup);
router.post("/login", authController.login);

module.exports = router;
