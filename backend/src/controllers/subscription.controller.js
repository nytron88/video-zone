import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const channel = await User.findById(channelId).lean();

  if (!channel) {
    throw new ApiError(404, `Channel with ID ${channelId} not found`);
  }

  const currentSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  }).lean();

  if (currentSubscription) {
    await Subscription.findByIdAndDelete(currentSubscription._id);
  } else {
    await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        currentSubscription
          ? "Unsubscribed from the channel successfully"
          : "Subscribed to the channel successfully"
      )
    );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const channel = await User.findById(channelId).lean();

  if (!channel) {
    throw new ApiError(404, `Channel with ID ${channelId} not found`);
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$subscriberDetails",
    },
    {
      $replaceRoot: { newRoot: "$subscriberDetails" },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(200, { subscribers }, "Subscribers fetched successfully")
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const subscriber = await User.findById(subscriberId).lean();

  if (!subscriber) {
    throw new ApiError(404, `User not found with ID ${subscriberId}`);
  }

  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$channelDetails",
    },
    {
      $replaceRoot: { newRoot: "$channelDetails" },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { channels },
        "Subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
