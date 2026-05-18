import express from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearAuthCookie, createToken, setAuthCookie } from "../utils/token.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
});

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
});

router.post(
  "/register",
  authLimiter,
  asyncHandler(async (req, res) => {
    const payload = registerSchema.parse(req.body);
    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });

    const token = createToken(user._id);
    setAuthCookie(res, token);

    return res.status(201).json({ user: user.toJSON() });
  }),
);

router.post(
  "/login",
  authLimiter,
  asyncHandler(async (req, res) => {
    const payload = loginSchema.parse(req.body);
    const user = await User.findOne({ email: payload.email }).select("+passwordHash");

    if (!user || !(await user.comparePassword(payload.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(user._id);
    setAuthCookie(res, token);

    return res.json({ user: user.toJSON() });
  }),
);

router.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  return res.json({ message: "Logged out successfully" });
});

router.get("/me", requireAuth, (req, res) => {
  return res.json({ user: req.user.toJSON() });
});

export default router;
