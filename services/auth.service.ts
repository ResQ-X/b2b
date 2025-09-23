import axiosInstance from "@/lib/axios";
import { Cookies } from "react-cookie";
import type {
  LoginFormData,
  SignupFormData,
  VerifyEmailData,
  ResendCodeData,
  requestPasswordResetData,
  resetPasswordData,
  AuthResponse,
  CreateServiceData,
} from "@/types/auth";

const cookies = new Cookies();

export const AuthService = {
  async signup(data: SignupFormData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/fleet-signup",
      data
    );
    return response.data;
  },

  async verifyEmail(data: VerifyEmailData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/verify-fleet-email",
      data
    );
    return response.data;
  },

  async resendCode(data: ResendCodeData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/resend-verification-fleet",
      data
    );
    return response.data;
  },

  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/fleet-login",
      data
    );
    if (response.data.accessToken) {
      cookies.set("accessToken", response.data.accessToken, { path: "/" });
      cookies.set("refreshToken", response.data.refreshToken, { path: "/" });
      cookies.set("user", JSON.stringify(response.data.user), { path: "/" });
    }
    return response.data;
  },

  async requestPasswordReset(
    data: requestPasswordResetData
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post(
      "/auth/forgot-password-fleet",
      data
    );
    return response.data;
  },

  async resetPassword(
    data: resetPasswordData
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post(
      "/auth/reset-password-fleet",
      data
    );
    return response.data;
  },

  async createService(
    data: CreateServiceData
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post("/resqx-services/create", data);
    return response.data;
  },

  logout() {
    cookies.remove("accessToken");
    cookies.remove("refreshToken");
    cookies.remove("user");
  },
};
