import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { Problem } from "../models/Problem.js";
import { Topic } from "../models/Topic.js";
import { UserProgress } from "../models/UserProgress.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const [totalProblems, completedProgress, topics, problems] = await Promise.all([
      Problem.countDocuments(),
      UserProgress.find({ userId: req.user._id, completed: true })
        .select("problemId")
        .lean(),
      Topic.find().sort({ order: 1 }).lean(),
      Problem.find().select("topicId difficulty").lean(),
    ]);

    const completedIds = new Set(
      completedProgress.map((progress) => progress.problemId.toString()),
    );

    const topicStats = topics.map((topic) => {
      const topicProblems = problems.filter(
        (problem) => problem.topicId.toString() === topic._id.toString(),
      );
      const completed = topicProblems.filter((problem) =>
        completedIds.has(problem._id.toString()),
      ).length;

      return {
        id: topic._id,
        title: topic.title,
        slug: topic.slug,
        completed,
        total: topicProblems.length,
        percentage: topicProblems.length
          ? Math.round((completed / topicProblems.length) * 100)
          : 0,
      };
    });

    const difficultyStats = ["Easy", "Medium", "Hard"].map((difficulty) => {
      const difficultyProblems = problems.filter((problem) => problem.difficulty === difficulty);
      const completed = difficultyProblems.filter((problem) =>
        completedIds.has(problem._id.toString()),
      ).length;

      return {
        difficulty,
        completed,
        total: difficultyProblems.length,
      };
    });

    return res.json({
      summary: {
        completed: completedProgress.length,
        total: totalProblems,
        percentage: totalProblems ? Math.round((completedProgress.length / totalProblems) * 100) : 0,
      },
      topicStats,
      difficultyStats,
    });
  }),
);

export default router;
