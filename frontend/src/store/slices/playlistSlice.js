import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/api";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/playlist", data);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const getPlaylistById = createAsyncThunk(
  "playlist/getPlaylistById",
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/playlist/${playlistId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  "playlist/updatePlaylist",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `/playlist/${data.playlistId}`,
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

export const deletePlaylist = createAsyncThunk(
  "playlist/deletePlaylist",
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/playlist/${playlistId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const addVideoToPlaylist = createAsyncThunk(
  "playlist/addVideoToPlaylist",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `/playlist/add/${data.videoId}/${data.playlistId}`
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

export const removeVideoFromPlaylist = createAsyncThunk(
  "playlist/removeVideoFromPlaylist",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `/playlist/remove/${data.videoId}/${data.playlistId}`
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

export const getUserPlaylists = createAsyncThunk(
  "playlist/getUserPlaylists",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/playlist/user/${userId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPlaylistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaylistById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getPlaylistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updatePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlaylist.fulfilled, (state) => {
        state.loading = false;
        state.data = null;
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addVideoToPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addVideoToPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeVideoFromPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(removeVideoFromPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default playlistSlice.reducer;
