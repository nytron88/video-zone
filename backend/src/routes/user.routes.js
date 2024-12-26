import { Router } from "express";
import {
  registerUser,
  //   loginUser,
  //   logoutUser,
  //   refreshAccessToken,
  //   changeCurrentPassword,
  //   getCurrentUser,
  //   updateAccountDetails,
  //   updateUserAvatar,
  //   updateUserCoverImage,
  //   getUserChannelProfile,
  //   getUserWatchHistory,
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import verifyLogin from "../middlewares/auth.middleware.js";
import validateFields from "../middlewares/validateFields.middleware.js";
import {
  registrationValidationRules,
  loginValidationRules,
} from "../validations/user.validation.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validateFields(registrationValidationRules),
  registerUser
);

// router.route("/login").post(loginUser);

// router.route("/logout").post(verifyJWT, logoutUser);

// router.route("/refresh-token").post(refreshAccessToken);

// router.route("/change-password").patch(verifyJWT, changeCurrentPassword);

// router.route("/profile").get(verifyJWT, getCurrentUser);

// router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// router
//   .route("/update-avatar")
//   .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// router
//   .route("/update-cover")
//   .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

// router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);

// router.route("/watch-history").get(verifyJWT, getUserWatchHistory);

export default router;
