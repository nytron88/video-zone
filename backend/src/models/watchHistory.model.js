import mongoose, { Schema, model } from "mongoose";

const watchHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: [true, "Video is required"],
    },
  },
  { timestamps: true }
);

export const WatchHistory = model("WatchHistory", watchHistorySchema);
