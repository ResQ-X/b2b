"use client";
import { Suspense, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import LogoSvg from "@/public/logo.svg";
import AuthImage from "@/public/auth-page.png";
import { Button } from "@/components/ui/button";
import AuthText from "@/components/auth/auth-text";
import type { AuthState, VerifyEmailData } from "@/types/auth";

type OTPArray = [string, string, string, string, string, string];

// ✅ Wrapper adds the required Suspense boundary
export default function VerifyEmailPage() {
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
    token: "",
  });

  console.log(verifyOtpData);

  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp] as OTPArray;
    next[index] = value;
    setOtp(next);

    const joined = next.join("");
    setVerifyOtpData((prev) => ({
      email: prev.email || emailFromQuery,
      token: joined,
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
        setVerifyOtpData((prev) => ({ ...prev, token: next.join("") }));
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
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
      token: joined,
    }));

    const last = Math.min(text.length, 6) - 1;
    inputsRef.current[last >= 0 ? last : 0]?.focus();
  };

  const code = otp.join("");
  console.log(code);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setAuthState({ isLoading: true, error: null });

    // Mock submit → redirect
    setTimeout(() => {
      setSuccessMsg("Email verified successfully!");
      setAuthState({ isLoading: false, error: null });
      router.push("/create-password");
    }, 1200);
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
        {/* Left side */}
        <AuthText />

        {/* Form side */}
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
                OTP Sent
              </h1>
              <p className="mt-6 text-sm text-white/90 font-medium text-center">
                We sent a 6 digit code to{" "}
                <span>{emailFromQuery || "your Email Address"}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-white">
              <div className="relative w-full max-w-[500px] mb-10 flex items-center justify-between gap-3">
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
                {authState.isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
