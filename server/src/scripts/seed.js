import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Problem } from "../models/Problem.js";
import { Topic } from "../models/Topic.js";
import { User } from "../models/User.js";
import { UserProgress } from "../models/UserProgress.js";

dotenv.config();

const youtubeSearch = (query) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

const curriculum = [
  {
    title: "Arrays",
    slug: "arrays",
    description: "Core array patterns including hashing, prefix ideas, intervals, and subarrays.",
    problems: [
      {
        title: "Two Sum",
        difficulty: "Easy",
        practice: "https://leetcode.com/problems/two-sum/",
        article: "https://neetcode.io/solutions/two-sum",
      },
      {
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        practice: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        article: "https://neetcode.io/solutions/best-time-to-buy-and-sell-stock",
      },
      {
        title: "Maximum Subarray",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/maximum-subarray/",
        article: "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/",
      },
      {
        title: "Merge Intervals",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/merge-intervals/",
        article: "https://neetcode.io/solutions/merge-intervals",
      },
      {
        title: "Product of Array Except Self",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/product-of-array-except-self/",
        article: "https://neetcode.io/solutions/product-of-array-except-self",
      },
    ],
  },
  {
    title: "Strings",
    slug: "strings",
    description: "String hashing, sliding window, grouping, and palindrome fundamentals.",
    problems: [
      {
        title: "Valid Anagram",
        difficulty: "Easy",
        practice: "https://leetcode.com/problems/valid-anagram/",
        article: "https://neetcode.io/solutions/valid-anagram",
      },
      {
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        article: "https://neetcode.io/solutions/longest-substring-without-repeating-characters",
      },
      {
        title: "Group Anagrams",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/group-anagrams/",
        article: "https://neetcode.io/solutions/group-anagrams",
      },
      {
        title: "Longest Palindromic Substring",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/longest-palindromic-substring/",
        article: "https://neetcode.io/solutions/longest-palindromic-substring",
      },
      {
        title: "Minimum Window Substring",
        difficulty: "Hard",
        practice: "https://leetcode.com/problems/minimum-window-substring/",
        article: "https://neetcode.io/solutions/minimum-window-substring",
      },
    ],
  },
  {
    title: "Linked List",
    slug: "linked-list",
    description: "Pointer manipulation, cycle detection, reversal, merging, and cache design.",
    problems: [
      {
        title: "Reverse Linked List",
        difficulty: "Easy",
        practice: "https://leetcode.com/problems/reverse-linked-list/",
        article: "https://neetcode.io/solutions/reverse-linked-list",
      },
      {
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        practice: "https://leetcode.com/problems/merge-two-sorted-lists/",
        article: "https://neetcode.io/solutions/merge-two-sorted-lists",
      },
      {
        title: "Linked List Cycle",
        difficulty: "Easy",
        practice: "https://leetcode.com/problems/linked-list-cycle/",
        article: "https://neetcode.io/solutions/linked-list-cycle",
      },
      {
        title: "Remove Nth Node From End of List",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        article: "https://neetcode.io/solutions/remove-nth-node-from-end-of-list",
      },
      {
        title: "LRU Cache",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/lru-cache/",
        article: "https://neetcode.io/solutions/lru-cache",
      },
    ],
  },
  {
    title: "Stack and Queue",
    slug: "stack-and-queue",
    description: "Monotonic stacks, queue simulation, parenthesis validation, and window maximums.",
    problems: [
      {
        title: "Valid Parentheses",
        difficulty: "Easy",
        practice: "https://leetcode.com/problems/valid-parentheses/",
        article: "https://neetcode.io/solutions/valid-parentheses",
      },
      {
        title: "Min Stack",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/min-stack/",
        article: "https://neetcode.io/solutions/min-stack",
      },
      {
        title: "Daily Temperatures",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/daily-temperatures/",
        article: "https://neetcode.io/solutions/daily-temperatures",
      },
      {
        title: "Sliding Window Maximum",
        difficulty: "Hard",
        practice: "https://leetcode.com/problems/sliding-window-maximum/",
        article: "https://neetcode.io/solutions/sliding-window-maximum",
      },
      {
        title: "Implement Queue using Stacks",
        difficulty: "Easy",
        practice: "https://leetcode.com/problems/implement-queue-using-stacks/",
        article: "https://neetcode.io/solutions/implement-queue-using-stacks",
      },
    ],
  },
  {
    title: "Trees",
    slug: "trees",
    description: "Binary tree traversal, recursion, BST invariants, and common interview patterns.",
    problems: [
      {
        title: "Maximum Depth of Binary Tree",
        difficulty: "Easy",
        practice: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        article: "https://neetcode.io/solutions/maximum-depth-of-binary-tree",
      },
      {
        title: "Invert Binary Tree",
        difficulty: "Easy",
        practice: "https://leetcode.com/problems/invert-binary-tree/",
        article: "https://neetcode.io/solutions/invert-binary-tree",
      },
      {
        title: "Binary Tree Level Order Traversal",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        article: "https://neetcode.io/solutions/binary-tree-level-order-traversal",
      },
      {
        title: "Validate Binary Search Tree",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/validate-binary-search-tree/",
        article: "https://neetcode.io/solutions/validate-binary-search-tree",
      },
      {
        title: "Lowest Common Ancestor of a Binary Search Tree",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
        article: "https://neetcode.io/solutions/lowest-common-ancestor-of-a-binary-search-tree",
      },
    ],
  },
  {
    title: "Graphs",
    slug: "graphs",
    description: "BFS, DFS, graph cloning, topological ordering, and shortest path basics.",
    problems: [
      {
        title: "Number of Islands",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/number-of-islands/",
        article: "https://neetcode.io/solutions/number-of-islands",
      },
      {
        title: "Clone Graph",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/clone-graph/",
        article: "https://neetcode.io/solutions/clone-graph",
      },
      {
        title: "Course Schedule",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/course-schedule/",
        article: "https://neetcode.io/solutions/course-schedule",
      },
      {
        title: "Rotting Oranges",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/rotting-oranges/",
        article: "https://neetcode.io/solutions/rotting-oranges",
      },
      {
        title: "Network Delay Time",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/network-delay-time/",
        article: "https://neetcode.io/solutions/network-delay-time",
      },
    ],
  },
  {
    title: "Binary Search",
    slug: "binary-search",
    description: "Search space design, sorted arrays, rotated arrays, and answer binary search.",
    problems: [
      {
        title: "Binary Search",
        difficulty: "Easy",
        practice: "https://leetcode.com/problems/binary-search/",
        article: "https://neetcode.io/solutions/binary-search",
      },
      {
        title: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        article: "https://neetcode.io/solutions/search-in-rotated-sorted-array",
      },
      {
        title: "Find Minimum in Rotated Sorted Array",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        article: "https://neetcode.io/solutions/find-minimum-in-rotated-sorted-array",
      },
      {
        title: "Koko Eating Bananas",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/koko-eating-bananas/",
        article: "https://neetcode.io/solutions/koko-eating-bananas",
      },
      {
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        practice: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        article: "https://neetcode.io/solutions/median-of-two-sorted-arrays",
      },
    ],
  },
  {
    title: "Dynamic Programming",
    slug: "dynamic-programming",
    description: "State definition, recurrence building, memoization, and tabulation.",
    problems: [
      {
        title: "Climbing Stairs",
        difficulty: "Easy",
        practice: "https://leetcode.com/problems/climbing-stairs/",
        article: "https://neetcode.io/solutions/climbing-stairs",
      },
      {
        title: "House Robber",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/house-robber/",
        article: "https://neetcode.io/solutions/house-robber",
      },
      {
        title: "Coin Change",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/coin-change/",
        article: "https://neetcode.io/solutions/coin-change",
      },
      {
        title: "Longest Increasing Subsequence",
        difficulty: "Medium",
        practice: "https://leetcode.com/problems/longest-increasing-subsequence/",
        article: "https://neetcode.io/solutions/longest-increasing-subsequence",
      },
      {
        title: "Edit Distance",
        difficulty: "Hard",
        practice: "https://leetcode.com/problems/edit-distance/",
        article: "https://neetcode.io/solutions/edit-distance",
      },
    ],
  },
];

const seed = async () => {
  await connectDB();

  await UserProgress.deleteMany({});
  await Problem.deleteMany({});
  await Topic.deleteMany({});

  for (const [topicIndex, topic] of curriculum.entries()) {
    const createdTopic = await Topic.create({
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      order: topicIndex + 1,
    });

    const problems = topic.problems.map((problem, problemIndex) => ({
      topicId: createdTopic._id,
      title: problem.title,
      difficulty: problem.difficulty,
      order: problemIndex + 1,
      resources: {
        youtube: youtubeSearch(`${problem.title} dsa explanation`),
        practice: problem.practice,
        article: problem.article,
      },
    }));

    await Problem.insertMany(problems);
  }

  const demoEmail = process.env.DEMO_USER_EMAIL || "student@example.com";
  const existingDemoUser = await User.findOne({ email: demoEmail });

  if (!existingDemoUser) {
    await User.create({
      name: "Demo Student",
      email: demoEmail,
      password: process.env.DEMO_USER_PASSWORD || "Student@123",
    });
  }

  const problemCount = await Problem.countDocuments();
  console.log(`Seeded ${curriculum.length} topics and ${problemCount} problems`);
  console.log(`Demo login: ${demoEmail} / ${process.env.DEMO_USER_PASSWORD || "Student@123"}`);
};

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
