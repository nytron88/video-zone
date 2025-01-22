import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/api";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const toggleSubscription = createAsyncThunk(
  "subscription/toggleSubscription",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/subscriptions/c/${channelId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const getUserChannelSubscribers = createAsyncThunk(
  "subscription/getUserChannelSubscribers",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/subscriptions/c/${channelId}`);
      return response.data.data.subscribers;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const getSubscribedChannels = createAsyncThunk(
  "subscription/getSubscribedChannels",
  async (subscriberUsername, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/subscriptions/u/${subscriberUsername}`
      );
      return response.data.data.channels;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(toggleSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserChannelSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserChannelSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(getUserChannelSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSubscribedChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscribedChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(getSubscribedChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;
