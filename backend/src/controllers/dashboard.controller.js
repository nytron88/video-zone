import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const stats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $group: {
        _id: null,
        totalLikes: { $sum: { $size: "$likes" } },
        totalViews: { $sum: "$views" },
        totalVideos: { $sum: 1 },
      },
    },
  ]);

  if (!stats.length) {
    throw new ApiError(404, "Channel not found or no videos available");
  }

  const subscriberCount = await Subscription.countDocuments({
    channel: channelId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos: stats[0]?.totalVideos || 0,
        totalViews: stats[0]?.totalViews || 0,
        totalLikes: stats[0]?.totalLikes || 0,
        totalSubscribers: subscriberCount,
      },
      "Channel stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const channel = await User.findById(channelId, "username email");

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const videoPipeline = [
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $project: {
        title: 1,
        views: 1,
        createdAt: 1,
        thumbnail: 1,
        totalLikes: { $size: "$likes" },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ];

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      docs: "videos",
      totalDocs: "totalVideos",
      totalPages: "totalPages",
      page: "currentPage",
    },
  };

  const videoResults = await Video.aggregatePaginate(
    Video.aggregate(videoPipeline),
    options
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        channel: {
          id: channel._id,
          username: channel.username,
          email: channel.email,
        },
        videos: videoResults.videos,
        pagination: {
          currentPage: videoResults.currentPage,
          totalPages: videoResults.totalPages,
          totalVideos: videoResults.totalVideos,
        },
      },
      "Channel videos fetched successfully"
    )
  );
});

export { getChannelStats, getChannelVideos };
