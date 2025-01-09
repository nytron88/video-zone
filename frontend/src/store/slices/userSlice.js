import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/api";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const getCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/users/profiles");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred."
      );
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
      });
  },
});

export default userSlice.reducer;
