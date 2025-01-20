import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/api";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const getAllVideos = createAsyncThunk(
  "video/getAllVideos",
  async (data, { rejectWithValue }) => {
    let url = "/videos";
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

export const publishAVideo = createAsyncThunk(
  "video/publishAVideo",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/videos", data);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const getVideoById = createAsyncThunk(
  "video/getVideoById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/videos/${data._id}?incrementView=${data.incrementView}`
      );
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const updateVideo = createAsyncThunk(
  "video/updateVideo",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/videos/${data._id}`, data);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const deleteVideo = createAsyncThunk(
  "video/deleteVideo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/videos/${id}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const togglePublishStatus = createAsyncThunk(
  "video/togglePublishStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/videos/toggle/publish/${id}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const searchVideosAndChannels = createAsyncThunk(
  "video/searchVideosAndChannels",
  async (data, { rejectWithValue }) => {
    let url = "/videos/search";
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
      return response.data.data.videos;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch videos.";
      })
      .addCase(publishAVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishAVideo.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(publishAVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to publish video.";
      })
      .addCase(getVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch video by ID.";
      })
      .addCase(updateVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update video.";
      })
      .addCase(deleteVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete video.";
      })
      .addCase(togglePublishStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePublishStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(togglePublishStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to toggle publish status.";
      })
      .addCase(searchVideosAndChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchVideosAndChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(searchVideosAndChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to search videos and channels.";
      });
  },
});

export default videoSlice.reducer;
