import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  searchVideosAndChannels,
} from "../controllers/video.controller.js";
import verifyLogin from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyLogin);

router.route("/").get(getAllVideos).post(publishAVideo);

router.route("/search").get(searchVideosAndChannels);

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
