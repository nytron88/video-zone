import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getUserWatchHistory,
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import verifyLogin from "../middlewares/auth.middleware.js";
import validateFields from "../middlewares/validateFields.middleware.js";
import {
  registrationValidationRules,
  changePasswordValidationRules,
  updateAccountDetailsValidationRules,
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

router.route("/login").post(loginUser);

router.route("/logout").post(verifyLogin, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router
  .route("/change-password")
  .patch(
    validateFields(changePasswordValidationRules),
    verifyLogin,
    changeCurrentPassword
  );

router.route("/profile").get(verifyLogin, getCurrentUser);

router
  .route("/update-account")
  .patch(
    validateFields(updateAccountDetailsValidationRules),
    verifyLogin,
    updateAccountDetails
  );

router
  .route("/update-avatar")
  .patch(verifyLogin, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-cover")
  .patch(verifyLogin, upload.single("coverImage"), updateUserCoverImage);

router.route("/channel/:username").get(verifyLogin, getUserChannelProfile);

router.route("/watch-history").get(verifyLogin, getUserWatchHistory);

export default router;
