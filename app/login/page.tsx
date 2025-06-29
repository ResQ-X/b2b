/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/auth.service";
import { useAuth } from "@/contexts/auth.context";
import type { AuthState, LoginFormData } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState({ isLoading: true, error: null });

    try {
      const response = await AuthService.login(formData);
      if (response.success && response.user) {
        setUser(response.user);
        router.push("/dashboard");
      }
    } catch (error: any) {
      setAuthState({
        isLoading: false,
        error: error.response?.data?.message || "Invalid credentials",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-7xl flex justify-around mx-auto">
        <div className="flex w-full flex-col justify-center max-w-[488px] px-4 sm:px-6 xl:px-12">
          <div className="mx-auto w-full flex justify-center flex-col max-w-sm">
            <div className="mb-8 flex items-center flex-col">
              <div className="w-[181px] h-[70px] relative mb-8">
                <Image
                  src="/ressqx.png"
                  alt="RESQ-X Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="text-5xl text-dark-brown font-medium">Welcome!</h1>
              <p className="mt-4 text-[13px] text-dark font-medium">
                Authorized Personnel: Sign in to access the dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="email"
                  className="w-full max-w-[400px] bg-orange bg-opacity-5 focus:ring-none focus:outline-none focus:border-orange h-[60px] rounded-[10px] border border-beige"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  placeholder="Email"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="password"
                  name="password"
                  className="w-full max-w-[400px] bg-orange bg-opacity-5 focus:ring-none focus:outline-none focus:border-orange h-[60px] rounded-[10px] border border-beige"
                  type="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {authState.error && (
                <p className="text-sm text-red-500">{authState.error}</p>
              )}

              <Button
                type="submit"
                className="w-full max-w-[400px] h-[60px] bg-orange hover:bg-opacity-80 hover:scale-105 transition-all hover:bg-orange duration-200"
                disabled={authState.isLoading}
              >
                {authState.isLoading ? "Signing in..." : "Sign In"}
              </Button>

              {/* <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                {/* <Button
                  variant="link"
                  className="text-orange hover:text-orange/80"
                  onClick={() => router.push("/signup")}
                >
                  Sign Up
                </Button> 
              </p> */}
            </form>
          </div>
        </div>

        <div className="relative hidden w-full max-w-[600px] h-[602px] lg:block rounded-3xl overflow-hidden">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="/resqman.jpeg"
            alt="Background"
            width={1200}
            height={800}
            priority
          />

          <div className="absolute inset-0 bg-black/60 z-10" />

          <div className="absolute inset-0 z-20 flex flex-col justify-center p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">
              Optimizing administrative workflow.
            </h2>
            <p className="text-lg max-w-xl">
              Enhancing efficiency, improving response times, and providing
              seamless operations for the team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
