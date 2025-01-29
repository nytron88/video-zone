import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { AuthLayout } from "./components/index.js";
import {
  Login,
  Signup,
  Home,
  EditProfile,
  ChangePassword,
  VideoUpload,
  ChannelDashboard,
  EditVideo,
  ChannelProfile,
  LikedVideos,
  WatchHistory,
  VideoDisplay,
  PostTweet,
  CreatePlaylist,
  TweetDisplay,
  EditTweet,
  PlaylistDisplay,
  SearchResults,
  ErrorPage,
} from "./pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route
        path="signup"
        element={
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        }
      />
      <Route
        path="login"
        element={
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="edit-profile"
        element={
          <AuthLayout authentication>
            <EditProfile />
          </AuthLayout>
        }
      />
      <Route
        path="change-password"
        element={
          <AuthLayout authentication>
            <ChangePassword />
          </AuthLayout>
        }
      />
      <Route
        path="upload"
        element={
          <AuthLayout authentication>
            <VideoUpload />
          </AuthLayout>
        }
      />
      <Route
        path="dashboard"
        element={
          <AuthLayout authentication>
            <ChannelDashboard />
          </AuthLayout>
        }
      />
      <Route
        path="video/edit/:videoId"
        element={
          <AuthLayout authentication>
            <EditVideo />
          </AuthLayout>
        }
      />
      <Route
        path="channel/:username"
        element={
          <AuthLayout authentication>
            <ChannelProfile />
          </AuthLayout>
        }
      />
      <Route
        path="liked"
        element={
          <AuthLayout authentication>
            <LikedVideos />
          </AuthLayout>
        }
      />
      <Route
        path="history"
        element={
          <AuthLayout authentication>
            <WatchHistory />
          </AuthLayout>
        }
      />
      <Route
        path="video/:videoId"
        element={
          <AuthLayout authentication>
            <VideoDisplay />
          </AuthLayout>
        }
      />
      <Route
        path="post-tweet"
        element={
          <AuthLayout authentication>
            <PostTweet />
          </AuthLayout>
        }
      />
      <Route
        path="create-playlist"
        element={
          <AuthLayout authentication>
            <CreatePlaylist />
          </AuthLayout>
        }
      />
      <Route
        path="tweet/:tweetId"
        element={
          <AuthLayout authentication>
            <TweetDisplay />
          </AuthLayout>
        }
      />
      <Route
        path="tweet/edit/:tweetId"
        element={
          <AuthLayout authentication>
            <EditTweet />
          </AuthLayout>
        }
      />
      <Route
        path="playlist/:playlistId"
        element={
          <AuthLayout authentication>
            <PlaylistDisplay />
          </AuthLayout>
        }
      />
      <Route
        path="search"
        element={
          <AuthLayout authentication>
            <SearchResults />
          </AuthLayout>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </Provider>
);
