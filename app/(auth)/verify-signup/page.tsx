"use client";
import { toast } from "react-toastify";
import { Suspense, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import LogoSvg from "@/public/logo.svg";
import AuthImage from "@/public/auth-page.png";
import { Button } from "@/components/ui/button";
import AuthText from "@/components/auth/auth-text";
import { AuthService } from "@/services/auth.service";
import type { AuthState, VerifyEmailData } from "@/types/auth";

type OTPArray = [string, string, string, string, string, string];

// Wrapper adds the required Suspense boundary
export default function VerifySignUpPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [otp, setOtp] = useState<OTPArray>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [verifyOtpData, setVerifyOtpData] = useState<VerifyEmailData>({
    email: emailFromQuery,
    code: "",
  });

  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  const [resendState, setResendState] = useState({
    isLoading: false,
  });

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp] as OTPArray;
    next[index] = value;
    setOtp(next);

    const joined = next.join("");
    setVerifyOtpData((prev) => ({
      email: prev.email || emailFromQuery,
      code: joined,
    }));

    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputsRef.current[index - 1]?.focus();
      } else {
        const next = [...otp] as OTPArray;
        next[index] = "";
        setOtp(next);
        setVerifyOtpData((prev) => ({ ...prev, code: next.join("") }));
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleResendCode = async () => {
    if (!emailFromQuery) {
      toast.error(
        "Email not found. Please try the forgot password process again."
      );
      return;
    }

    setResendState({ isLoading: true });
    setAuthState({ isLoading: false, error: null });

    try {
      const response = await AuthService.resendCode({
        email: emailFromQuery,
      });

      if (response?.success === true) {
        setResendState({ isLoading: false });
        toast.success(
          response.message || "Verification code sent successfully!"
        );

        // Clear OTP inputs for new code
        setOtp(["", "", "", "", "", ""]);
        setVerifyOtpData({
          email: emailFromQuery,
          code: "",
        });

        // Focus first input
        inputsRef.current[0]?.focus();
      } else {
        setResendState({ isLoading: false });
        toast.error(
          response?.message || "Failed to resend code. Please try again."
        );
      }
    } catch (error: any) {
      setResendState({ isLoading: false });
      toast.error(
        error?.response?.data?.message ||
          "Failed to resend code. Please try again."
      );
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;

    const next: OTPArray = ["", "", "", "", "", ""];
    for (let i = 0; i < text.length && i < 6; i++) next[i] = text[i];
    setOtp(next);

    const joined = next.join("");
    setVerifyOtpData((prev) => ({
      email: prev.email || emailFromQuery,
      code: joined,
    }));

    const last = Math.min(text.length, 6) - 1;
    inputsRef.current[last >= 0 ? last : 0]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState({ isLoading: true, error: null });

    // Validate OTP is complete
    if (verifyOtpData.code.length !== 6) {
      setAuthState({ isLoading: false, error: null });
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    // Validate email exists
    if (!verifyOtpData.email) {
      setAuthState({ isLoading: false, error: null });
      toast.error(
        "Email not found. Please try the forgot password process again."
      );
      return;
    }

    try {
      const response = await AuthService.verifyEmail(verifyOtpData);
      if (response?.success === true) {
        toast.success("Email verified successfully!");
        setAuthState({ isLoading: false, error: null });
        router.push("/subscription");

        // router.push(
        //   `/create-password?email=${encodeURIComponent(
        //     emailFromQuery
        //   )}&token=${encodeURIComponent(otp.join(""))}`
        // );
      } else {
        setAuthState({ isLoading: false, error: null });
        toast.error(
          response?.message || "Verification failed. Please try again."
        );
      }
    } catch (error: any) {
      setAuthState({ isLoading: false, error: null });
      toast.error(
        error?.response?.data?.message ||
          "Invalid verification code. Please try again."
      );
    }
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
        {/* Left side */}
        <AuthText />

        {/* Form side */}
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
                Verify your Email
              </h1>
              <p className="mt-6 text-sm text-white/90 font-medium text-center">
                We sent a 6 digit code to{" "}
                <span className="text-orange font-semibold">
                  {emailFromQuery || "your Email Address"}
                </span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-white">
              <div className="relative w-full mb-10 flex items-center justify-between gap-1 lg:gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputsRef.current[i] = el;
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={otp[i]}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl md:text-3xl font-semibold rounded-xl bg-[#3B3835] text-[#fff] focus:outline-none focus:ring-2 focus:ring-orange border border-[#474747] shadow-sm"
                    aria-label={`Digit ${i + 1}`}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <Button
                type="submit"
                variant="orange"
                className="w-full h-[52px]"
                disabled={authState.isLoading || otp.join("").length !== 6}
              >
                {authState.isLoading ? "Verifying..." : "Verify Email"}
              </Button>

              <div className="flex items-center justify-between text-center text-sm text-white/90">
                <Button
                  type="button"
                  variant="link"
                  className="text-orange hover:text-orange/80 p-0"
                  onClick={() => router.push("/forgot-password")}
                >
                  Back to Forgot Password
                </Button>

                <Button
                  type="button"
                  variant="link"
                  className="text-orange hover:text-orange/80 p-0"
                  onClick={handleResendCode}
                  disabled={resendState.isLoading}
                >
                  {resendState.isLoading ? "Sending..." : "Resend Code"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
