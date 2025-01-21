import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import videoReducer from "./slices/videoSlice";
import uploadReducer from "./slices/uploadSlice";
import watchHistoryReducer from "./slices/watchHistorySlice";
import tweetReducer from "./slices/tweetSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import playlistReducer from "./slices/playlistSlice";
import dashboardSlice from "./slices/dashboardSlice";
import likeSlice from "./slices/likeSlice";
import commentSlice from "./slices/commentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    video: videoReducer,
    upload: uploadReducer,
    watchHistory: watchHistoryReducer,
    tweet: tweetReducer,
    subscription: subscriptionReducer,
    playlist: playlistReducer,
    dashboard: dashboardSlice,
    like: likeSlice,
    comment: commentSlice,
  },
});
