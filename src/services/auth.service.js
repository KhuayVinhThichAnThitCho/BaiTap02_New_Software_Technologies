const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const {
  sendOTPEmail,
  sendForgotPasswordOTPEmail,
} = require("../utils/mail.util");

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

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Email không tồn tại");
  }

  const otpCode = generateOTP();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  user.otpCode = otpCode;
  user.otpExpires = otpExpires;
  await user.save();

  await sendForgotPasswordOTPEmail(email, otpCode);

  return {
    email,
    message: "OTP đặt lại mật khẩu đã được gửi về email.",
  };
};

const resetPassword = async ({ email, otpCode, newPassword }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Email không tồn tại");
  }

  if (user.otpCode !== otpCode) {
    throw new Error("OTP không chính xác");
  }

  if (!user.otpExpires || user.otpExpires < new Date()) {
    throw new Error("OTP đã hết hạn");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.otpCode = null;
  user.otpExpires = null;

  await user.save();

  return {
    message: "Đặt lại mật khẩu thành công.",
  };
};

const editProfile = async (userId, data) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User không tồn tại");
  }

  const allowedFields = ["name", "phone", "address", "avatar"];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      user[field] = data[field];
    }
  });

  await user.save();

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    role: user.role,
  };
};

module.exports = {
  register,
  forgotPassword,
  resetPassword,
  editProfile,
};