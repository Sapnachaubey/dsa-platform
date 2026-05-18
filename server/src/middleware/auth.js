import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { readAuthToken, verifyToken } from "../utils/token.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = readAuthToken(req);

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const payload = verifyToken(token);
  const user = await User.findById(payload.userId);

  if (!user) {
    return res.status(401).json({ message: "Invalid session" });
  }

  req.user = user;
  return next();
});
