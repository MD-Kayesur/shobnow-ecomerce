import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1";

const getVisitorId = () => {
  if (typeof window === "undefined") return undefined;
  const storageKey = "shopnow_visitor_id";
  let visitorId = window.localStorage.getItem(storageKey);
  if (!visitorId) {
    visitorId = typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
          const random = Math.floor(Math.random() * 16);
          return (char === "x" ? random : (random & 0x3) | 0x8).toString(16);
        });
    window.localStorage.setItem(storageKey, visitorId);
  }
  return visitorId;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth?: { token?: string | null } }).auth?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const visitorId = getVisitorId();
    if (visitorId) headers.set("x-visitor-id", visitorId);
    return headers;
  },
});

let refreshInFlight: Promise<{ data?: unknown; error?: FetchBaseQueryError; meta?: FetchBaseQueryMeta }> | null = null;

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  try {
    let result = await rawBaseQuery(args, api, extraOptions);
    const requestUrl = typeof args === "string" ? args : args.url;
    const shouldSkipRefresh = /\/auth\/(login|register|verify-otp|resend-otp|send-otp|forgot-password|reset-password|refresh-token|logout)/.test(requestUrl);

    if (result.error?.status === 401 && !shouldSkipRefresh) {
      if (!refreshInFlight) {
        refreshInFlight = Promise.resolve(rawBaseQuery(
          { url: "/auth/refresh-token", method: "POST", body: {} },
          api,
          extraOptions,
        )).finally(() => { refreshInFlight = null; });
      }
      const refreshed = await refreshInFlight!;
      const session = (refreshed.data as { data?: { accessToken?: string; user?: unknown } } | undefined)?.data;
      if (session?.accessToken && session.user) {
        const serverUser = session.user as Record<string, unknown>;
        const user = {
          ...serverUser,
          role: String(serverUser.role).toLowerCase() === "admin" ? "admin" : "user",
        };
        api.dispatch({
          type: "auth/setUser",
          payload: { token: session.accessToken, user },
        });
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch({ type: "auth/logOut" });
      }
    }
    return result;
  } catch (error) {
    console.error("API Error:", error);
    return { error: { status: "FETCH_ERROR", error: "Failed to fetch" } };
  }
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Users", "Products", "Taxonomy", "Banners", "Reviews", "Wishlist", "PromoBar", "Newsletter", "Orders", "Coupons"],
  endpoints: () => ({}),
});
