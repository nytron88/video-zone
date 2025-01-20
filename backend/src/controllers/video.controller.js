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
import { deleteFromCloudinary } from "../utils/cloudinary.js";

// search functionality to search for videos with basic query and pagination,
// mainly for video display on a channel, simple and lightweigh queries, and userId based search
// on the frontend client
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
    const sortFields = sortBy.split(",");
    const sortTypes = sortType.split(",");
    const sortCriteria = {};

    if (sortFields.length !== sortTypes.length) {
      throw new ApiError(400, "Invalid sort options");
    }

    sortFields.forEach(
      (field, index) =>
        (sortCriteria[field.trim()] =
          sortTypes[index]?.trim() === "asc" ? 1 : -1)
    );

    if (!sortCriteria.createdAt) {
      sortCriteria.createdAt = -1;
    }

    pipeline.push({
      $sort: sortCriteria,
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
  const { title, description, uploadedVideoResponse, thumbnailLink } = req.body;

  if (!title || !description || !uploadedVideoResponse || !thumbnailLink) {
    if (uploadedVideoResponse) {
      await deleteFromCloudinary(videoLink.secure_url, "videos");
    }

    if (thumbnailLink) {
      await deleteFromCloudinary(thumbnailLink, "thumbnails");
    }
    throw new ApiError(400, "Please provide all required fields");
  }

  const video = await Video.create({
    videoFile: uploadedVideoResponse.secure_url,
    thumbnail: thumbnailLink,
    title,
    description,
    duration: uploadedVideoResponse.duration,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { incrementView = false } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const updateQuery = incrementView === "true" ? { $inc: { views: 1 } } : {};

  const video = await Video.findByIdAndUpdate(videoId, updateQuery, {
    new: true,
  });

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

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
  const { title, description, uploadedVideoResponse, thumbnailLink } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (req.user._id.toString() !== video.owner.toString()) {
    throw new ApiError(
      403,
      "You do not have permission to perform this action on this resource"
    );
  }

  if (!title && !description && !uploadedVideoResponse) {
    throw new ApiError(400, "Please provide at least one field to update");
  }

  const updates = {};

  if (title) updates.title = title;
  if (description) updates.description = description;

  if (uploadedVideoResponse) {
    await deleteFromCloudinary(video.videoFile, "videos");

    updates.videoFile = uploadedVideoResponse.secure_url;
  }

  if (thumbnailLink) {
    await deleteFromCloudinary(video.thumbnail, "thumbnails");
    updates.thumbnail = thumbnailLink;
  }

  const updatedVideo = await Video.findByIdAndUpdate(videoId, updates, {
    new: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
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
        403,
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
  await deleteFromCloudinary(deletedVideo.videoFile, "videos");
  await deleteFromCloudinary(deletedVideo.thumbnail, "thumbnails");

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

// search functionality to search for videos and channels using mongodb Atlas search,
// mainly for the search bar in the frontend client
const searchVideosAndChannels = asyncHandler(async (req, res) => {
  const {
    query,
    type = "all",
    page = 1,
    limit = 10,
    sortBy = "score",
  } = req.query;

  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  if (type !== "all" && type !== "videos" && type !== "channels") {
    throw new ApiError(400, "Invalid search type");
  }

  if (page < 1 || limit < 1) {
    throw new ApiError(400, "Invalid page or limit value");
  }

  if (!["score", "createdAt", "views"].includes(sortBy)) {
    throw new ApiError(400, "Invalid sort option");
  }

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  let videoResults = { results: [], totalResults: 0, totalPages: 0 };
  let channelResults = { results: [], totalResults: 0, totalPages: 0 };

  if (type === "videos" || type === "all") {
    const videoPipeline = [
      {
        $search: {
          index: "videoIndex",
          compound: {
            should: [
              {
                autocomplete: {
                  query: query,
                  path: "title",
                  score: { boost: { value: 3 } },
                  fuzzy: {
                    maxEdits: 2,
                    prefixLength: 1,
                  },
                },
              },
              {
                autocomplete: {
                  query: query,
                  path: "description",
                  score: { boost: { value: 1 } },
                  fuzzy: {
                    maxEdits: 2,
                    prefixLength: 1,
                  },
                },
              },
            ],
          },
        },
      },
      {
        $match: {
          isPublished: true,
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
          score: { $meta: "searchScore" },
        },
      },
      {
        $sort:
          sortBy === "score"
            ? { score: -1 }
            : sortBy === "createdAt"
            ? { createdAt: -1 }
            : { views: -1, score: -1 },
      },
    ];

    const videoCount = await Video.aggregate([
      ...videoPipeline,
      { $count: "total" },
    ]);
    const totalVideoResults = videoCount[0]?.total || 0;

    const videoSearchResults = await Video.aggregate([
      ...videoPipeline,
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber },
      {
        $project: {
          title: 1,
          description: 1,
          thumbnail: 1,
          "owner.username": 1,
          "owner.avatar": 1,
          createdAt: 1,
          views: 1,
          score: 1,
        },
      },
    ]);

    videoResults = {
      results: videoSearchResults,
      totalResults: totalVideoResults,
      totalPages: Math.ceil(totalVideoResults / limitNumber),
    };
  }

  if (type === "channels" || type === "all") {
    const channelsPipeline = [
      {
        $search: {
          index: "userIndex",
          compound: {
            should: [
              {
                autocomplete: {
                  query: query,
                  path: "username",
                  score: { boost: { value: 3 } },
                  fuzzy: { maxEdits: 2, prefixLength: 1 },
                },
              },
              {
                autocomplete: {
                  query: query,
                  path: "fullname",
                  score: { boost: { value: 1 } },
                  fuzzy: { maxEdits: 2, prefixLength: 1 },
                },
              },
            ],
          },
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
          score: { $meta: "searchScore" },
        },
      },
      {
        $project: {
          username: 1,
          fullname: 1,
          avatar: 1,
          subscribersCount: 1,
          isSubscribed: 1,
          score: 1,
        },
      },
      {
        $sort: { score: -1 },
      },
    ];

    const channelCount = await User.aggregate([
      ...channelsPipeline,
      { $count: "total" },
    ]);
    const totalChannelResults = channelCount[0]?.total || 0;

    const channelSearchResults = await User.aggregate([
      ...channelsPipeline,
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber },
      {
        $project: {
          username: 1,
          avatar: 1,
          subscribersCount: 1,
          isSubscribed: 1,
          fullName: 1,
          score: 1,
        },
      },
    ]);

    channelResults = {
      results: channelSearchResults,
      totalResults: totalChannelResults,
      totalPages: Math.ceil(totalChannelResults / limitNumber),
    };
  }

  const totalResults = videoResults.totalResults + channelResults.totalResults;
  const totalPages = Math.max(
    videoResults.totalPages,
    channelResults.totalPages
  );

  let statusCode = 200;
  let responseData = {
    videos: videoResults.results.length > 0 ? videoResults.results : null,
    totalVideos: videoResults.totalResults,
    channels: channelResults.results.length > 0 ? channelResults.results : null,
    totalChannels: channelResults.totalResults,
    pagination: {
      currentPage: pageNumber,
      totalPages: totalPages,
      totalResults: totalResults,
    },
  };

  let message = "Results found";
  if (totalResults === 0) {
    message = "No results found for the given query";
    responseData = null;
    statusCode = 204;
  }

  return res
    .status(200)
    .json(new ApiResponse(statusCode, responseData, message));
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
