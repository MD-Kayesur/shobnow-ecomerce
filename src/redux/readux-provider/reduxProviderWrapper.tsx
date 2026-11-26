"use client";
import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import Cookies from "js-cookie";
import { store } from "../store";
import { finishAuthInitialization, setUser } from "@/redux/features/auth/authSlice";
import { useRefreshSessionMutation } from "@/redux/features/auth/authApi";

const AuthSessionBootstrap = ({ children }: { children: React.ReactNode }) => {
  const [refreshSession] = useRefreshSessionMutation();
  const started = useRef(false);

  useEffect(() => {
    // Remove credentials saved by the old JS-readable cookie/localStorage flow.
    Cookies.remove("token");
    localStorage.removeItem("user");
    localStorage.removeItem("persist:auth");

    if (started.current) return;
    started.current = true;
    refreshSession()
      .unwrap()
      .then((response) => {
        const user = {
          ...response.data.user,
          role: String(response.data.user.role).toLowerCase() === "admin" ? "admin" as const : "user" as const,
        };
        store.dispatch(setUser({ user, token: response.data.accessToken }));
      })
      .catch(() => undefined)
      .finally(() => store.dispatch(finishAuthInitialization()));
  }, [refreshSession]);

  return <>{children}</>;
};

const ReduxProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <AuthSessionBootstrap>{children}</AuthSessionBootstrap>
  </Provider>
);

export default ReduxProviderWrapper;
