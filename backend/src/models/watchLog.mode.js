import mongoose, { Schema, model } from "mongoose";

const watchLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

export const WatchLog = model("WatchLog", watchLogSchema);
