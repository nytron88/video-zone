import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/api";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const toggleVideoLike = createAsyncThunk(
  "like/toggleVideoLike",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`likes/toggle/v/${videoId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  "like/toggleCommentLike",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`likes/toggle/c/${commentId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const toggleTweetLike = createAsyncThunk(
  "like/toggleTweetLike",
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`likes/toggle/t/${tweetId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const getLikedVideos = createAsyncThunk(
  "like/getLikedVideos",
  async (data, { rejectWithValue }) => {
    let url = "/likes/videos";
    try {
      const queryParams = Object.entries(data || {})
        .filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      if (queryParams) {
        url += `?${queryParams}`;
      }
      const response = await apiClient.get(url);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

const likeSlice = createSlice({
  name: "like",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(toggleVideoLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(toggleVideoLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleCommentLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLikedVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getLikedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;
