import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./hooks/baseApi";
import authReducer from "@/redux/features/auth/authSlice";
import cartReducer from "@/redux/features/cart/cartSlice";

export const store = configureStore({
  devTools: import.meta.env.DEV,
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
