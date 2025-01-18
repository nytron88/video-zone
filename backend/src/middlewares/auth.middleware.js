import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const verifyLogin = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, {
        message: "Invalid access token",
        invalid_access_token: true,
      });
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error.message?.message || {
        message: "Invalid access token",
        invalid_access_token: true,
      }
    );
  }
});

export default verifyLogin;
