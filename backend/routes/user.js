const express = require("express");
const { body } = require("express-validator");

const userController = require("../controllers/user");

const router = express.Router();

/* ALL REQUESTS UNDER  /api/users */

router.post("/login", userController.login);

router.post(
  "/signup",
  [
    body("email")
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email"),
    body("password")
      .trim()
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage("Password is required")
      .isLength({ min: 4 })
      .withMessage("Password min length: 4"),
  ],
  userController.signup
);

module.exports = router;
