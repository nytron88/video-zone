import { Router } from "express";
import {
  createTweet,
  getTweetById,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import verifyLogin from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyLogin);

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router
  .route("/:tweetId")
  .get(getTweetById)
  .patch(updateTweet)
  .delete(deleteTweet);

export default router;
