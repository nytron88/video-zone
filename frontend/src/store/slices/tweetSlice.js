import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/api";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const createTweet = createAsyncThunk(
  "tweet/createTweet",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/tweets", data);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const getTweetById = createAsyncThunk(
  "tweet/getTweetById",
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/tweets/${tweetId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const getUserTweets = createAsyncThunk(
  "tweet/getUserTweets",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/tweets/user/${userId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const updateTweet = createAsyncThunk(
  "tweet/updateTweet",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/tweets/${data._id}`, data);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const deleteTweet = createAsyncThunk(
  "tweet/deleteTweet",
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/tweets/${tweetId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTweetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTweetById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getTweetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserTweets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserTweets.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getUserTweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTweet.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTweet.fulfilled, (state, _) => {
        state.loading = false;
        state.data = null;
      })
      .addCase(deleteTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tweetSlice.reducer;
