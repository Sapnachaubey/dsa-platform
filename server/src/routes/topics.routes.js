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
    const includeProblems = req.query.includeProblems === "true";
    const topics = await Topic.find().sort({ order: 1 }).lean();

    if (!includeProblems) {
      return res.json({ topics });
    }

    const [problems, completedProgress] = await Promise.all([
      Problem.find()
        .sort({ topicId: 1, order: 1 })
        .lean(),
      UserProgress.find({ userId: req.user._id, completed: true })
        .select("problemId completed completedAt")
        .lean(),
    ]);

    const completedByProblem = new Map(
      completedProgress.map((item) => [item.problemId.toString(), item]),
    );

    const problemsByTopic = problems.reduce((acc, problem) => {
      const topicKey = problem.topicId.toString();
      const completed = completedByProblem.get(problem._id.toString());
      const enrichedProblem = {
        ...problem,
        id: problem._id,
        completed: Boolean(completed),
        completedAt: completed?.completedAt || null,
      };

      if (!acc.has(topicKey)) {
        acc.set(topicKey, []);
      }

      acc.get(topicKey).push(enrichedProblem);
      return acc;
    }, new Map());

    const response = topics.map((topic) => {
      const topicProblems = problemsByTopic.get(topic._id.toString()) || [];
      const completedCount = topicProblems.filter((problem) => problem.completed).length;

      return {
        ...topic,
        id: topic._id,
        problems: topicProblems,
        progress: {
          completed: completedCount,
          total: topicProblems.length,
          percentage: topicProblems.length
            ? Math.round((completedCount / topicProblems.length) * 100)
            : 0,
        },
      };
    });

    return res.json({ topics: response });
  }),
);

export default router;
