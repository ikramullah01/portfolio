const express = require("express");

const projectController = require("../controllers/project");
const projectValidation = require("../validations/project");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/user-projects", isAuth, projectController.getUserProjects);
router.post(
  "/user-project",
  isAuth,
  [projectValidation()],
  projectController.postUserProject
);
router.delete(
  "/user-project/:projectId",
  isAuth,
  projectController.deleteProject
);

module.exports = router;
