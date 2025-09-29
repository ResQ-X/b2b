import axiosInstance from "@/lib/axios";
import { Cookies } from "react-cookie";
import type {
  User,
  UpdateProfileData,
  UpdateProfileResponse,
  ChangePasswordData,
  ChangePasswordResponse,
} from "@/types/account";

const cookies = new Cookies();

export const AccountService = {
  async getProfile(): Promise<User> {
    const res = await axiosInstance.get<User>("/fleets/profile");
    const user = res.data;

    // Keep cookie in sync (optional but handy if other parts read from cookie)
    cookies.set("user", JSON.stringify(user), { path: "/" });
    return user;
  },

  async updateProfile(data: UpdateProfileData): Promise<UpdateProfileResponse> {
    const res = await axiosInstance.patch<UpdateProfileResponse>(
      "/fleets/update-user-details",
      data
    );

    if (res.data?.success && res.data.user) {
      cookies.set("user", JSON.stringify(res.data.user), { path: "/" });
    }

    return res.data;
  },

  async initializeChangePassword(): Promise<ChangePasswordResponse> {
    const res = await axiosInstance.post<ChangePasswordResponse>(
      "/fleets/change-password-init"
      // No body data - only token from headers/cookies
    );
    return res.data;
  },

  async changePassword(
    data: ChangePasswordData
  ): Promise<ChangePasswordResponse> {
    const res = await axiosInstance.post<ChangePasswordResponse>(
      "/fleets/change-password-verify",
      {
        token: data.token,
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
      }
    );
    return res.data;
  },

  /**
   * Manually refresh cookie from server state (convenience).
   */
  async refreshFromServer(): Promise<User> {
    const user = await this.getProfile();
    return user;
  },
};
