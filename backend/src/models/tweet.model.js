import mongoose, { Schema, model } from "mongoose";

const tweetSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
  },
  { timestamps: true }
);

export const Tweet = model("Tweet", tweetSchema);
