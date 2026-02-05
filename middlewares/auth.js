import jwt from "jsonwebtoken";
import { AppError } from "../utils/custom-error.js";
import { TryCatch } from "./error.js";
import { User } from "../models/user.js";

const isAuthenticated = TryCatch(async (req, res, next) => {
  const tokenFromHeader = req.headers["authorization"]
    ? req.headers["authorization"].replace("Bearer ", "")
    : null;
  const tokenFromCookie = req.cookies?.["access-token"];

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return next(
      new AppError(
        "Unauthenticated! Please login to access this resource.",
        401,
      ),
    );
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedToken._id).lean();

  if (!user) {
    return next(new AppError("User no longer exists.", 401));
  }

  req.user = user;

  next();
});

export { isAuthenticated };
