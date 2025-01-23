import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/api";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const getVideoComments = createAsyncThunk(
  "comment/getVideoComments",
  async (data, { rejectWithValue }) => {
    let url = `comments/v/${data.videoId}`;
    try {
      const queryParams = Object.entries(data || {})
        .filter(
          ([key, value]) =>
            key !== "videoId" &&
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
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const addVideoComment = createAsyncThunk(
  "comment/addVideoComment",
  async (comment, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `comments/v/${comment.videoId}`,
        comment
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

export const getTweetComments = createAsyncThunk(
  "comment/getTweetComments",
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`comments/t/${tweetId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const addTweetComment = createAsyncThunk(
  "comment/addTweetComment",
  async (comment, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `comments/t/${comment.tweetId}`,
        comment
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

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`comments/c/${commentId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `comments/c/${data.commentId}`,
        data
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

const commentSlice = createSlice({
  name: "comment",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getVideoComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVideoComments.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getVideoComments.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(addVideoComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVideoComment.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(addVideoComment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getTweetComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTweetComments.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getTweetComments.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(addTweetComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTweetComment.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(addTweetComment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteComment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateComment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default commentSlice.reducer;
