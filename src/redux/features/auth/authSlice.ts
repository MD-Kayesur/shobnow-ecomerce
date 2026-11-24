import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, TAuth } from "@/redux/types/auth.type";
import { AppRootState } from "@/redux/store";

const initialState: TAuth = {
  user: null,
  token: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isInitialized = true;
    },
    finishAuthInitialization: (state) => {
      state.isInitialized = true;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isInitialized = true;
    },
  },
});

export const { setUser, logOut, finishAuthInitialization } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentToken = (state: AppRootState) => state.auth.token;
export const useCurrentUser = (state: AppRootState) => state.auth.user;
