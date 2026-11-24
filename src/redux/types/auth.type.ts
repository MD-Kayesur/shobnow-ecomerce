export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "client" | "distributor" | "accountant";
  businessName?: string;
  address_Pickup_Location?: string;
  phone?: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    challengeId?: string;
    requiresVerification?: boolean;
    nextStep?: string;
    email?: string;
  };
};

export type SessionResponse = {
  success: boolean;
  message: string;
  data: { accessToken: string; user: User };
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: Pick<User, "id" | "name" | "email" | "role"> & { phoneNumber: string | null };
};

export type TAuth = {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
};

export type OtpType = "ACCOUNT_VERIFY" | "PASSWORD_RESET" | "LOGIN";

export type VerifyOtpRequest = {
  email: string;
  code: string;
  type: OtpType;
  challengeId?: string;
};

export type ResendOtpRequest = {
  email: string;
  type: OtpType;
  challengeId?: string;
};

export type VerifyOtpResponse = {
  success: boolean;
  message: string;
  data:
    | { accessToken: string; user: User }
    | { resetToken: string }
    | null;
};

export type OtpActionResponse = {
  success: boolean;
  message: string;
  data: null;
};

export type ForgotPasswordRequest = { email: string };
export type ResetPasswordRequest = { resetToken: string; newPassword: string };

export type LoginRequest = {
  email: string;
  password: string;
};
