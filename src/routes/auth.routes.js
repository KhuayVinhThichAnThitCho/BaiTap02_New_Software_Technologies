const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

const {
  forgotPasswordValidation,
  resetPasswordValidation,
  editProfileValidation,
} = require("../middlewares/validate.middleware");

const { forgotPasswordLimiter } = require("../middlewares/rateLimit.middleware");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/register", authController.register);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPasswordValidation,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordValidation,
  authController.resetPassword
);

router.put(
  "/edit-profile",
  authMiddleware,
  editProfileValidation,
  authController.editProfile
);

module.exports = router;