const express = require("express");

const userController = require("../controllers/user");
const userValidation = require("../validations/user");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/user", isAuth, userController.getUser);
router.post("/user", [userValidation()], userController.postUser);

module.exports = router;
