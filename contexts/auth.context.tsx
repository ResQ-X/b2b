"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cookies } from "react-cookie";
import type { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const cookies = new Cookies();

  useEffect(() => {
    const userFromCookie = cookies.get("user");
    if (userFromCookie) {
      // Check if userFromCookie is already an object
      if (typeof userFromCookie === "string") {
        setUser(JSON.parse(userFromCookie));
      } else {
        setUser(userFromCookie);
      }
      console.log(userFromCookie)
    }
  }, [cookies.get]);

  const value = {
    user,
    isAuthenticated: !!user,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}