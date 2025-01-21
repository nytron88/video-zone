import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import verifyLogin from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyLogin);

router.route("/").post(createTweet);
router.route("/user/:username").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;
