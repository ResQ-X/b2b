/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import LogoSvg from "@/public/logo.svg";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AuthService } from "@/services/auth.service";
import { useState } from "react";
import AuthImage from "@/public/auth-page.png";
import AuthText from "@/components/auth/auth-text";
import type { AuthState, ForgotPasswordFormData } from "@/types/auth";
import CustomInput from "@/components/ui/CustomInput";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setAuthState({ isLoading: true, error: null });

    setTimeout(() => router.push("/verify-otp"), 1200);

    // try {
    //   // Adjust this call name to match your service method
    //   // e.g. AuthService.requestPasswordReset(formData.email)
    //   // or AuthService.forgotPassword(formData)
    //   await AuthService.requestPasswordReset(formData.email);

    //   setSuccessMsg(
    //     "If an account exists for this email, we’ve sent a reset link. Please check your inbox (and spam)."
    //   );
    //   setAuthState({ isLoading: false, error: null });

    //   // Optional: redirect after a short delay
    //   // setTimeout(() => router.push(`/verify-reset?email=${encodeURIComponent(formData.email)}`), 1200);
    // } catch (error: any) {
    //   setAuthState({
    //     isLoading: false,
    //     error:
    //       error?.response?.data?.message ||
    //       "Unable to send reset link. Please try again.",
    //   });
    // }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center"
      style={{
        backgroundImage: `url(${AuthImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 w-full max-w-7xl flex justify-around mx-auto">
        {/* Left side text (kept) */}
        <AuthText />

        {/* Form */}
        <div className="flex w-full flex-col justify-center max-w-[900px] px-4 sm:px-6 xl:px-12">
          <div className="mx-auto w-full flex justify-center flex-col max-w-lg">
            <div className="mb-8 flex items-center flex-col">
              <div className="relative mb-8" style={{ width: 181, height: 70 }}>
                <Image
                  src={LogoSvg}
                  alt="RESQ-X Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <h1 className="text-4xl md:text-5xl text-white font-medium">
                Forgot Password?
              </h1>
              <p className="mt-6 text-sm text-white/90 font-medium text-center">
                Enter your Email Address to Reset Password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-white">
              <div className="space-y-2 relative w-full max-w-[500px] mb-10">
                <CustomInput
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {successMsg && (
                <p className="text-sm text-emerald-300">{successMsg}</p>
              )}
              {authState.error && (
                <p className="text-sm text-red-400">{authState.error}</p>
              )}

              <Button
                type="submit"
                className="w-full max-w-[500px] h-[60px] bg-orange hover:bg-opacity-80 hover:scale-105 transition-all hover:bg-orange duration-200"
                disabled={authState.isLoading}
              >
                {authState.isLoading ? "Sending..." : "Send OTP"}
              </Button>

              <p className="text-center text-sm text-white/90">
                Remembered your password?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-orange hover:text-orange/80"
                  onClick={() => router.push("/login")}
                >
                  Back to Sign In
                </Button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
