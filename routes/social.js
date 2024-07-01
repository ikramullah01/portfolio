const express = require("express");

const socialController = require("../controllers/social");
const socialValidation = require("../validations/social");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/user-social", isAuth, socialController.getUserSocial);
router.post(
  "/user-social",
  isAuth,
  [socialValidation()],
  socialController.postUserSocial
);
router.delete("/user-social/:socialId", isAuth, socialController.deleteSocial);

module.exports = router;
