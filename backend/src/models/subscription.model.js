import mongoose, { model, Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Channel is required"],
    },
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Subscriber is required"],
    },
  },
  { timestamps: true }
);

export const Subscription = model("Subscription", subscriptionSchema);
