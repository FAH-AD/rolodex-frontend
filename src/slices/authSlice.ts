import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Services
import { authApi } from "@services/authApi";

// Interfaces & Types
import { AuthState, User } from "@interfaces/auth";
import type { RootState } from "@app/store";

type LoggedInPayload = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedIn: (state, action: PayloadAction<LoggedInPayload>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    loggedOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    });
    builder.addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    });
    builder.addMatcher(authApi.endpoints.registerPaswordless.matchFulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    });
    builder.addMatcher(authApi.endpoints.getProfile.matchFulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    });
    builder.addMatcher(authApi.endpoints.loginWithGoogle.matchFulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    });
    builder.addMatcher(authApi.endpoints.loginWithMagicLink.matchFulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    });
  },
});

export const { loggedIn, loggedOut } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsClient = (state: RootState) => state.auth.user?.role === "client";
export const selectIsAdmin = (state: RootState) => state.auth.user?.role === "admin";
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
