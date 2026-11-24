import { baseApi } from "@/redux/hooks/baseApi";
import {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  OtpActionResponse,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  SessionResponse,
} from "@/redux/types/auth.type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    refreshSession: builder.mutation<SessionResponse, void>({
      query: () => ({ url: "/auth/refresh-token", method: "POST", body: {} }),
    }),
    exchangeOAuthCode: builder.mutation<SessionResponse, { code: string }>({
      query: (body) => ({ url: "/auth/oauth/exchange", method: "POST", body }),
    }),
    logout: builder.mutation<OtpActionResponse, void>({
      query: () => ({ url: "/auth/logout", method: "POST", body: {} }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),
    resendOtp: builder.mutation<OtpActionResponse, ResendOtpRequest>({
      query: (body) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation<OtpActionResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<OtpActionResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshSessionMutation,
  useExchangeOAuthCodeMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
} = authApi;
