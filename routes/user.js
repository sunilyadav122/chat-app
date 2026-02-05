import express from "express";
import {
  getMyProfile,
  login,
  logout,
  register,
  searchUsers,
} from "../controllers/user.js";
import { singleAvatarUpload } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";

const route = express.Router();

route.post("/new", singleAvatarUpload, register);
route.post("/login", login);
route.get("/me", isAuthenticated, getMyProfile);
route.get("/logout", isAuthenticated, logout);
route.get("/search", isAuthenticated, searchUsers);

export default route;
