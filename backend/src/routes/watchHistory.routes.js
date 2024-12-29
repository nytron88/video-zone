import { Router } from "express";
import {
  getUserWatchHistory,
  deleteVideoFromWatchHistory,
} from "../controllers/watchHistory.controller.js";
import verifyLogin from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyLogin);

router.route("/").get(getUserWatchHistory);

router.route("/:videoId").delete(deleteVideoFromWatchHistory);

export default router;
