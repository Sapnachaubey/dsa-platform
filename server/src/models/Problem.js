import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    youtube: String,
    practice: String,
    article: String,
  },
  { _id: false },
);

const problemSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
      index: true,
    },
    order: {
      type: Number,
      required: true,
    },
    resources: {
      type: resourceSchema,
      default: {},
    },
  },
  { timestamps: true },
);

problemSchema.index({ topicId: 1, order: 1 });

export const Problem = mongoose.model("Problem", problemSchema);
