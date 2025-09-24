"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { Cookies } from "react-cookie";
import type {
  User,
  UpdateProfileData,
  UpdateProfileResponse,
  ChangePasswordData,
  ChangePasswordResponse,
} from "@/types/account";

interface AccountContextType {
  account: User | null;
  loading: boolean;
  updateProfile: (data: UpdateProfileData) => Promise<UpdateProfileResponse>;
  changePassword: (data: ChangePasswordData) => Promise<ChangePasswordResponse>;
  setAccount: (user: User | null) => void;
  refreshAccount: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const cookies = new Cookies();

  // Load account data from cookies when provider mounts
  useEffect(() => {
    const userFromCookie = cookies.get("user");
    if (userFromCookie) {
      try {
        setAccount(
          typeof userFromCookie === "string"
            ? JSON.parse(userFromCookie)
            : userFromCookie
        );
      } catch (error) {
        console.error("Error parsing account from cookie:", error);
        cookies.remove("user");
        setAccount(null);
      }
    }
  }, []);

  const updateProfile = async (
    data: UpdateProfileData
  ): Promise<UpdateProfileResponse> => {
    setLoading(true);
    try {
      // Replace with your API call
      const res = await fetch("/api/account/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("token")}`,
        },
        body: JSON.stringify(data),
      });

      const result: UpdateProfileResponse = await res.json();

      if (result.success && result.user) {
        setAccount(result.user);
        cookies.set("user", JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, message: "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    data: ChangePasswordData
  ): Promise<ChangePasswordResponse> => {
    setLoading(true);
    try {
      // Replace with your API call
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("token")}`,
        },
        body: JSON.stringify(data),
      });

      const result: ChangePasswordResponse = await res.json();
      return result;
    } catch (error) {
      console.error("Change password error:", error);
      return { success: false, message: "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  const refreshAccount = () => {
    const userFromCookie = cookies.get("user");
    if (userFromCookie) {
      try {
        setAccount(
          typeof userFromCookie === "string"
            ? JSON.parse(userFromCookie)
            : userFromCookie
        );
      } catch (error) {
        console.error("Error parsing refreshed account:", error);
        setAccount(null);
      }
    }
  };

  const value: AccountContextType = {
    account,
    loading,
    updateProfile,
    changePassword,
    setAccount,
    refreshAccount,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
