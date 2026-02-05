import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const connectDB = (uri) => {
  mongoose
    .connect(uri, {
      dbName: "astpp",
    })
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      throw err;
    });
};

const sendToken = (res, user, statusCode, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  return res
    .status(statusCode)
    .cookie("access-token", token, cookieOptions)
    .json({
      success: true,
      message,
      data: {
        token,
        user,
      },
    });
};

const emitEvent = (req, event, users, data) => {
  console.log("Emitting event:", event, "to users:", users);
};

export { connectDB, sendToken, cookieOptions, emitEvent };
