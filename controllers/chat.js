import { ALERT, REFETCH_CHAT } from "../constants/events.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { AppError } from "../utils/custom-error.js";
import { emitEvent } from "../utils/features.js";

const createGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length < 2)
    return next(new AppError("A group chat requires at least 3 members", 400));

  const allMembers = [...members, req.user._id];

  await Chat.create({
    name,
    isGroupChat: true,
    creator: req.user._id,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `New group chat "${name}" created`); // Notifying
  emitEvent(req, REFETCH_CHAT, members, null);

  return res.status(201).json({
    success: true,
    message: "Group chat created successfully",
  });
});

const otherMember = (members, userId) =>
  members.find((member) => member._id.toString() !== userId.toString());

const getMyChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: { $in: [req.user._id] },
  }).populate("members", "name avatar");

  const transformedChat = chats.map((chat) => ({
    _id: chat._id,
    name: chat.isGroupChat
      ? chat.name
      : otherMember(chat.members, req.user._id).name,
    isGroupChat: chat.isGroupChat,
    members: chat.members.reduce((prev, curr) => {
      if (curr._id.toString() !== req.user._id.toString()) {
        prev.push(curr._id);
      }
      return prev;
    }, []),
    avatar: chat.isGroupChat
      ? chat.members?.slice(0, 3).map((member) => member.avatar.url)
      : [otherMember(chat.members, req.user._id).avatar.url],
  }));

  return res.status(200).json({
    success: true,
    message: "Chats fetched successfully",
    data: transformedChat,
  });
});

const getMyGroups = TryCatch(async (req, res) => {
  const groups = await Chat.find({
    members: {
      $in: [req.user._id],
    },
    isGroupChat: true,
    creator: req.user._id,
  }).populate("members", "name avatar");

  const transformedGroups = groups.map((group) => ({
    _id: group._id,
    name: group.name,
    isGroupChat: group.isGroupChat,
    members: group.members.reduce((prev, curr) => {
      if (curr._id.toString() !== req.user._id.toString()) {
        prev.push(curr._id);
      }
      return prev;
    }, []),
    avatar: group.members?.slice(0, 3).map((member) => member.avatar.url),
  }));

  return res.status(200).json({
    success: true,
    message: "Groups fetched successfully",
    data: transformedGroups,
  });
});

export { createGroupChat, getMyChats, getMyGroups };
