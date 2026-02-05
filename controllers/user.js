import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { cookieOptions, sendToken } from "../utils/features.js";
import { AppError } from "../utils/custom-error.js";
import { TryCatch } from "../middlewares/error.js";

const register = TryCatch(async (req, res) => {
  const { name, username, password } = req.body;

  const user = await User.create({
    name,
    username,
    password,
    avatar: {
      public_id: "sample_id",
      url: `/uploads/`,
    },
  });

  return sendToken(res, user, 201, "Registered Successfully!");
});

const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    username,
  }).select("+password");

  if (!user) return next(new AppError("User not found", 404));

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) return next(new AppError("Invalid credentials", 401));

  return sendToken(res, user, 200, `Login successful!`);
});

const getMyProfile = TryCatch(async (req, res) => {
  const user = req.user;

  return res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: user,
  });
});

const logout = (req, res) => {
  return res
    .status(200)
    .cookie("access-token", null, { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
      data: null,
    });
};

const searchUsers = TryCatch(async (req, res) => {
  const { name } = req.query;

  return res.status(200).json({
    success: true,
    message: "User search successful",
    data: [],
  });
});

export { login, register, getMyProfile, logout, searchUsers };
