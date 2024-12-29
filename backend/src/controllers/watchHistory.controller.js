import { WatchHistory } from "../models/watchHistory.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const getUserWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
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
              video: 1,
              _id: 0,
            },
          },
          {
            $addFields: {
              video: { $arrayElemAt: ["$video", 0] },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        watchHistory: "$watchHistory",
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, user[0].watchHistory, "Watch history found"));
});

const deleteVideoFromWatchHistory = asyncHandler(async (req, res) => {});

export { getUserWatchHistory, deleteVideoFromWatchHistory };
