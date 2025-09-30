"use client";
import { toast } from "react-toastify";
import Image from "next/image";
import LogoSvg from "@/public/logo.svg";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState({ isLoading: true, error: null });

    try {
      const response = await AuthService.requestPasswordReset(formData);
      if (
        response?.success === true &&
        response?.message === "Verification code sent successfully"
      ) {
        setAuthState({ isLoading: false, error: null });
        toast.success(response.message);
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } else {
        setAuthState({ isLoading: false, error: null });
        toast.error(
          response?.message || "Unexpected response. Please try again."
        );
      }
    } catch (error: any) {
      setAuthState({ isLoading: false, error: null });
      toast.error(
        error?.response?.data?.message ||
          "Unable to send reset link. Please try again."
      );
    }
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

      <div className="relative z-10 w-full max-w-7xl flex items-center justify-around mx-auto">
        {/* Left side text */}
        <AuthText />

        {/* Form */}
        <div className="flex w-full flex-col justify-center max-w-[600px] px-4 sm:px-6 xl:px-12">
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
              <div className="space-y-2 relative w-full mb-10">
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

              <Button
                type="submit"
                variant="orange"
                className="w-full h-[52px]"
                disabled={authState.isLoading}
              >
                {authState.isLoading ? "Sending..." : "Send OTP"}
              </Button>

              <p className="flex items-center justify-center text-center text-sm text-white/90">
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
