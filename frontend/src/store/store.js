import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import videoReducer from "./slices/videoSlice";
import uploadReducer from "./slices/uploadSlice";
import watchHistoryReducer from "./slices/watchHistorySlice";
import tweetReducer from "./slices/tweetSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import playlistReducer from "./slices/playlistSlice";

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
  },
});
