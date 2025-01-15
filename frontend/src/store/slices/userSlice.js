import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/api";
import abortControllerSingleton from "../../services/abortControllerSingleton";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const getCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async (_, { rejectWithValue }) => {
    const newAbortController = new AbortController();
    abortControllerSingleton.setController(newAbortController);

    const cachedUser = localStorage.getItem("currentUser");
    const lastFetch = localStorage.getItem("lastFetchTime");
    const now = Date.now();

    const cooldownPeriod = 10 * 1000;
    if (cachedUser && lastFetch && now - lastFetch < cooldownPeriod) {
      console.log("Using cached user data due to cooldown.");
      return JSON.parse(cachedUser);
    }

    try {
      const response = await apiClient.get("/users/profile", {
        signal: newAbortController.signal,
      });
      const userData = response.data.data;

      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("lastFetchTime", now);

      return userData;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Failed to fetch user profile:", error);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changeCurrentPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch("/users/change-password", data);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const updateAccount = createAsyncThunk(
  "user/updateAccount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch("/users/update-account", data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "user/updateAvatar",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch("/users/update-avatar", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const updateCover = createAsyncThunk(
  "user/updateCover",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch("/users/update-cover", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCover.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCover.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(updateCover.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
