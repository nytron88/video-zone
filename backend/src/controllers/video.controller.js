import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { WatchHistory } from "../models/watchHistory.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs/promises";
import { allowedImageMimeTypes, allowedVideoMimeTypes } from "../constants.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const pipeline = [];

  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }

    pipeline.push({
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    });
  }

  if (sortBy && sortType) {
    pipeline.push({
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    });
  }

  if (query) {
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
    });
  }

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              password: 0,
              email: 0,
              refreshToken: 0,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ["$owner", 0] },
      },
    }
  );

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

  const result = await Video.aggregatePaginate(
    Video.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Videos retrieved successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const videoFile = req.files?.videoFile?.[0];
  const thumbnail = req.files?.thumbnail?.[0];

  if (!title || !description || !videoFile || !thumbnail) {
    if (videoFile) {
      await fs.unlink(videoFile.path);
    }

    if (thumbnail) {
      await fs.unlink(thumbnail.path);
    }
    throw new ApiError(400, "Please provide all required fields");
  }

  if (!allowedVideoMimeTypes.includes(videoFile.mimetype)) {
    await fs.unlink(videoFile.path);
    await fs.unlink(thumbnail.path);
    throw new ApiError(
      400,
      "Invalid video file type. Allowed types: MP4, AVI, MKV"
    );
  }

  if (!allowedImageMimeTypes.includes(thumbnail.mimetype)) {
    await fs.unlink(videoFile.path);
    await fs.unlink(thumbnail.path);
    throw new ApiError(
      400,
      "Invalid thumbnail file type. Allowed types: JPEG, PNG, WEBP"
    );
  }

  const videoFileLocalPath = videoFile.path;
  const thumbnailLocalPath = thumbnail.path;

  const uploadedVideoFile = await uploadOnCloudinary(videoFileLocalPath);
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!uploadedVideoFile || !uploadedThumbnail) {
    throw new ApiError(500, "Error uploading files");
  }

  const video = await Video.create({
    videoFile: uploadedVideoFile.url,
    thumbnail: uploadedThumbnail.url,
    title,
    description,
    duration: uploadedVideoFile.duration,
    owner: req.user._id,
  })

  return res
    .status(201)
    .json(new ApiResponse(200, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const videoData = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              password: 0,
              email: 0,
              refreshToken: 0,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ["$owner", 0] },
      },
    },
  ]);

  if (!videoData?.length) {
    throw new ApiError(404, "Video not found");
  }

  const video = await Video.findByIdAndUpdate(
    videoData[0]._id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "-password -email -refreshToken");

  await WatchHistory.findOneAndUpdate(
    {
      user: req.user._id,
      video: video._id,
    },
    {},
    {
      upsert: true,
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video retrieved successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  if (!title && !description && !req.file) {
    throw new ApiError(400, "Please provide at least one field to update");
  }

  const updates = {};

  if (title) updates.title = title;
  if (description) updates.description = description;

  if (req.file) {
    if (!allowedImageMimeTypes.includes(req.file?.mimetype)) {
      await fs.unlink(req.file.path);
      throw new ApiError(
        400,
        "Invalid thumbnail file type. Allowed types: JPEG, PNG, WEBP"
      );
    }

    const thumbnailLocalPath = req.file?.path;

    const video = await Video.findById(videoId);

    await deleteFromCloudinary(video.thumbnail);
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!uploadedThumbnail) {
      await fs.unlink(req.file.path);
      throw new ApiError(500, "Error uploading thumbnail");
    }

    updates.thumbnail = uploadedThumbnail.url;
  }

  const video = await Video.findByIdAndUpdate(videoId, updates, { new: true });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (req.user._id.toString() !== video.owner.toString()) {
    return next(
      new ApiError(
        401,
        "You do not have permission to perform this action on this resource"
      )
    );
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  await WatchHistory.deleteMany({ video: videoId });
  await Comment.deleteMany({ video: videoId });
  await Like.deleteMany({ video: videoId });
  await Playlist.updateMany(
    { videos: videoId },
    { $pull: { videos: videoId } }
  );
  await deleteFromCloudinary(deletedVideo.videoFile);
  await deleteFromCloudinary(deletedVideo.thumbnail);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.isPublished = !video.isPublished;

  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        video.isPublished
          ? "Video published successfully"
          : "Video unpublished successfully"
      )
    );
});

const searchVideosAndChannels = asyncHandler(async (req, res) => {
  const { query, type = "all", page = 1, limit = 10 } = req.query;

  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  if (type !== "all" && type !== "videos" && type !== "channels") {
    throw new ApiError(400, "Invalid search type");
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    customLabels: {
      docs: "results",
      totalDocs: "totalResults",
      totalPages: "totalPages",
      page: "currentPage",
    },
  };

  let videoResults = { results: [], totalResults: 0, totalPages: 0 };
  let channelResults = { results: [], totalResults: 0, totalPages: 0 };

  if (type === "videos" || type === "all") {
    const videoPipeline = [
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $addFields: {
          owner: { $arrayElemAt: ["$owner", 0] },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          thumbnail: 1,
          "owner.username": 1,
          "owner.avatar": 1,
          createdAt: 1,
        },
      },
    ];

    videoResults = await Video.aggregatePaginate(
      Video.aggregate(videoPipeline),
      options
    );
  }

  if (type === "channels" || type === "all") {
    const channelsPipeline = [
      {
        $match: {
          username: { $regex: query, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $addFields: {
          subscribersCount: { $size: "$subscribers" },
          isSubscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          username: 1,
          avatar: 1,
          subscribersCount: 1,
          isSubscribed: 1,
          fullName: 1,
        },
      },
    ];

    channelResults = await User.aggregatePaginate(
      User.aggregate(channelsPipeline),
      options
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos: videoResults.results,
        totalVideos: videoResults.totalResults,
        channels: channelResults.results,
        totalChannels: channelResults.totalResults,
        pagination: {
          currentPage: options.page,
          totalPages: Math.max(
            videoResults.totalPages,
            channelResults.totalPages
          ),
        },
      },
      "Results found"
    )
  );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  searchVideosAndChannels,
};
