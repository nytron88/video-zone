import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import verifyLogin from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyLogin);

router
  .route("/c/:channelId")
  .get(getUserChannelSubscribers)
  .post(toggleSubscription);

router.route("/u/:subscriberUsername").get(getSubscribedChannels);

export default router;
