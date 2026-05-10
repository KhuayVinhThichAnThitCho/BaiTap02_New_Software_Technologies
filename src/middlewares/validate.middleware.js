const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: errors.array(),
    });
  }

  next();
};

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  handleValidationErrors,
];

const resetPasswordValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ"),

  body("otpCode").notEmpty().withMessage("OTP không được để trống"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải có ít nhất 6 ký tự"),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Mật khẩu xác nhận không khớp");
    }
    return true;
  }),

  handleValidationErrors,
];

const editProfileValidation = [
  body("name").optional().notEmpty().withMessage("Tên không được để trống"),

  body("phone")
    .optional()
    .isLength({ min: 9, max: 20 })
    .withMessage("Số điện thoại không hợp lệ"),

  body("address")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Địa chỉ tối đa 255 ký tự"),

  body("avatar").optional().isURL().withMessage("Avatar phải là URL hợp lệ"),

  handleValidationErrors,
];

module.exports = {
  forgotPasswordValidation,
  resetPasswordValidation,
  editProfileValidation,
};