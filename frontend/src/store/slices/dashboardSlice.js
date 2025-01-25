import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/api";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const getChannelStats = createAsyncThunk(
  "dashboard/getChannelStats",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/dashboard/stats/${channelId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const getChannelVideos = createAsyncThunk(
  "dashboard/getChannelVideos",
  async (data, { rejectWithValue }) => {
    let url = `/dashboard/videos/${data.channelId}`;
    try {
      const queryParams = Object.entries(data || {})
        .filter(
          ([key, value]) =>
            key !== "username" &&
            value !== undefined &&
            value !== null &&
            value !== ""
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

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getChannelStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChannelStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getChannelStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getChannelVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChannelVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getChannelVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
