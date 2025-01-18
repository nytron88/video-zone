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
} from "../controllers/user.controller.js";
import verifyLogin from "../middlewares/auth.middleware.js";
import validateFields from "../middlewares/validateFields.middleware.js";
import {
  registrationValidationRules,
  changePasswordValidationRules,
  updateAccountDetailsValidationRules,
} from "../validations/user.validation.js";

const router = Router();

router
  .route("/register")
  .post(validateFields(registrationValidationRules), registerUser);

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

router.route("/update-avatar").patch(verifyLogin, updateUserAvatar);

router.route("/update-cover").patch(verifyLogin, updateUserCoverImage);

router.route("/channel/:username").get(verifyLogin, getUserChannelProfile);

export default router;
