"use client";
import Image from "next/image";
import LogoSvg from "@/public/logo.svg";
import { useRouter, useSearchParams } from "next/navigation";
// import { AuthService } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import { Suspense, useState } from "react";
import AuthImage from "@/public/auth-page.png";
import AuthText from "@/components/auth/auth-text";
import type { AuthState, CreateNewPasswordData } from "@/types/auth";
import { Eye, EyeOff } from "lucide-react";
import CustomInput from "@/components/ui/CustomInput";

// ✅ Wrapper adds the required Suspense boundary
export default function CreateNewPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black/70" />}>
      <CreateNewPasswordForm />
    </Suspense>
  );
}

function CreateNewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // From previous step (/verify-otp?email=...&token=...)
  const emailFromQuery = searchParams.get("email") || "";
  const tokenFromQuery = searchParams.get("token") || "";

  const [data, setData] = useState<CreateNewPasswordData>({
    email: emailFromQuery || undefined,
    token: tokenFromQuery,
    password: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({ password: false, confirm: false });

  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const passwordsMatch = data.password === (data.confirmPassword || "");
  // const hasMinLen = data.password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setAuthState({ isLoading: true, error: null });

    // TODO: re-enable validations + API call when ready
    setTimeout(() => router.push("/login"), 1200);
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
      {/* Overlay */}
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

              <h1 className="text-3xl md:text-5xl text-white font-medium">
                Create New Password
              </h1>
              <p className="mt-6 text-sm text-white/90 font-medium text-center">
                Set a new password for{" "}
                <span className="font-semibold">
                  {data.email || "your account"}
                </span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-white">
              {/* Password */}
              <div className="relative w-full max-w-[500px]">
                <div className="relative w-full">
                  <CustomInput
                    label="Password"
                    id="password"
                    name="password"
                    type={show.password ? "text" : "password"}
                    placeholder="Enter new password"
                    value={data.password}
                    onChange={onChange}
                    required
                    className="pr-12 text-white placeholder:text-white/70"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShow((p) => ({ ...p, password: !p.password }))
                    }
                    className="absolute right-4 top-[65%] -translate-y-1/2 text-white/90"
                    aria-label={
                      show.password ? "Hide password" : "Show password"
                    }
                  >
                    {show.password ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="relative w-full max-w-[500px]">
                <div className="relative w-full">
                  <CustomInput
                    label="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    type={show.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={data.confirmPassword || ""}
                    onChange={onChange}
                    required
                    className="pr-12 text-white placeholder:text-white/70"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShow((p) => ({ ...p, confirm: !p.confirm }))
                    }
                    className="absolute right-4 top-[65%] -translate-y-1/2 text-white/90"
                    aria-label={
                      show.confirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {show.confirm ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {!passwordsMatch && (data.confirmPassword?.length || 0) > 0 && (
                  <p className="mt-2 text-xs text-red-300">
                    Passwords do not match.
                  </p>
                )}
              </div>

              {/* Messages */}
              {successMsg && (
                <p className="text-sm text-emerald-300">{successMsg}</p>
              )}
              {authState.error && (
                <p className="text-sm text-red-400">{authState.error}</p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full max-w-[500px] h-[60px] bg-orange hover:bg-opacity-80 hover:scale-105 transition-all duration-200"
                disabled={authState.isLoading}
              >
                {authState.isLoading ? "Saving..." : "Save New Password"}
              </Button>

              {/* Back to login */}
              <p className="text-center text-sm text-white/90">
                Done already?{" "}
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
