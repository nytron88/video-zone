import { WatchHistory } from "../models/watchHistory.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const getUserWatchHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const aggregateQuery = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "watchhistories",
        localField: "_id",
        foreignField: "user",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "videos",
              localField: "video",
              foreignField: "_id",
              as: "video",
              pipeline: [
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
                    pipeline: [
                      {
                        $project: {
                          fullname: 1,
                          username: 1,
                          avatar: 1,
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
              ],
            },
          },
          {
            $project: {
              video: { $arrayElemAt: ["$video", 0] },
              updatedAt: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$watchHistory",
    },
    {
      $sort: { "watchHistory.updatedAt": -1 },
    },
    {
      $addFields: {
        "watchHistory.video.watchedAt": "$watchHistory.updatedAt",
      },
    },
    {
      $replaceRoot: { newRoot: "$watchHistory.video" },
    },
  ];

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const result = await User.aggregatePaginate(
    User.aggregate(aggregateQuery),
    options
  );

  console.log(result);

  const responseData = {
    videos: result.docs,
    totalVideos: result.totalDocs,
    limit: result.limit,
    currentPage: result.page,
    totalPages: result.totalPages,
    pagingCounter: result.pagingCounter,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, responseData, "Watch history fetched successfully")
    );
});

const deleteVideoFromWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const deletionConfirmation = await WatchHistory.deleteOne({
    user: req.user._id,
    video: videoId,
  });

  if (deletionConfirmation.deletedCount === 0) {
    throw new ApiError(404, "Video not found in watch history");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted from watch history"));
});

export { getUserWatchHistory, deleteVideoFromWatchHistory };
