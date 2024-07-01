const express = require("express");

const serviceController = require("../controllers/service");
const serviceValidation = require("../validations/service");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/user-services", isAuth, serviceController.getUserServices);
router.post(
  "/user-service",
  isAuth,
  [serviceValidation()],
  serviceController.postUserService
);
router.delete(
  "/user-service/:serviceId",
  isAuth,
  serviceController.deleteService
);

module.exports = router;
