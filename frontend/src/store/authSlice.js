import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
