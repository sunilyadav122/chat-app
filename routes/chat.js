import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createGroupChat,
  getMyChats,
  getMyGroups,
} from "../controllers/chat.js";

const router = express.Router();

router.post("/new", isAuthenticated, createGroupChat);
router.get("/my", isAuthenticated, getMyChats);
router.get("/my/groups", isAuthenticated, getMyGroups);

export default router;
