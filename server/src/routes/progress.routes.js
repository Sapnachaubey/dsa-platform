import express from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { Problem } from "../models/Problem.js";
import { UserProgress } from "../models/UserProgress.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

const updateProgressSchema = z.object({
  completed: z.boolean(),
});

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const progress = await UserProgress.find({ userId: req.user._id, completed: true })
      .select("problemId completed completedAt")
      .lean();

    return res.json({ progress });
  }),
);

router.put(
  "/:problemId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { problemId } = req.params;
    const payload = updateProgressSchema.parse(req.body);

    if (!mongoose.isValidObjectId(problemId)) {
      return res.status(400).json({ message: "Invalid problem id" });
    }

    const problem = await Problem.findById(problemId).select("_id");

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const progress = await UserProgress.findOneAndUpdate(
      { userId: req.user._id, problemId },
      {
        completed: payload.completed,
        completedAt: payload.completed ? new Date() : null,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();

    return res.json({ progress });
  }),
);

export default router;
