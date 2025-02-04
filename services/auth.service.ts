import { Cookies } from "react-cookie"
import axiosInstance from "@/lib/axios"
import type { LoginFormData, SignupFormData, VerifyEmailData, AuthResponse } from "@/types/auth"

const cookies = new Cookies()

export const AuthService = {
  async signup(data: SignupFormData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/auth/signup", data)
    return response.data
  },

  async verifyEmail(data: VerifyEmailData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/auth/verify_email_verification_token", data)
    return response.data
  },

  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", data)

    if (response.data.accessToken) {
      cookies.set("accessToken", response.data.accessToken, { path: "/" })
      cookies.set("refreshToken", response.data.refreshToken, { path: "/" })
      cookies.set("user", JSON.stringify(response.data.user), { path: "/" })
    }

    return response.data
  },

  logout() {
    cookies.remove("accessToken")
    cookies.remove("refreshToken")
    cookies.remove("user")
  },
}

