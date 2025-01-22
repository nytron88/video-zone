import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/api";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const getUserWatchHistory = createAsyncThunk(
  "watchHistory/getUserWatchHistory",
  async (data, { rejectWithValue }) => {
    let url = "/watchHistory";
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

export const deleteVideoFromWatchHistory = createAsyncThunk(
  "watchHistory/deleteVideoFromWatchHistory",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/watchHistory/${videoId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

const watchHistorySlice = createSlice({
  name: "watchHistory",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getUserWatchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserWatchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getUserWatchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteVideoFromWatchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideoFromWatchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [];
      })
      .addCase(deleteVideoFromWatchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default watchHistorySlice.reducer;
