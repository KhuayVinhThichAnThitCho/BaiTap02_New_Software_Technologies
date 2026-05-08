const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { sendOTPEmail } = require("../utils/mail.util");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otpCode = generateOTP();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user",
    isVerified: false,
    otpCode,
    otpExpires,
  });

  await sendOTPEmail(email, otpCode);

  return {
    userId: user.id,
    email: user.email,
    message: "Đăng ký thành công. Vui lòng kiểm tra email để lấy OTP.",
  };
};

module.exports = {
  register,
};