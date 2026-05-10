const rateLimit = require("express-rate-limit");

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Bạn yêu cầu OTP quá nhiều lần. Vui lòng thử lại sau.",
  },
});

module.exports = {
  forgotPasswordLimiter,
};