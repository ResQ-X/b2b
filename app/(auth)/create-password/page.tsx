"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import LogoSvg from "@/public/logo.svg";
import { AuthService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import AuthImage from "@/public/auth-page.png";
import AuthText from "@/components/auth/auth-text";
import type { AuthState } from "@/types/auth";
import { Eye, EyeOff } from "lucide-react";
import CustomInput from "@/components/ui/CustomInput";

export default function CreatePasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    token: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({ password: false, confirm: false });
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  const passwordsMatch = data.newPassword === data.confirmPassword;

  // Fetch email from cookie on mount
  useEffect(() => {
    async function fetchEmail() {
      try {
        const res = await fetch("/api/auth/get-reset-email", {
          cache: "no-store",
        });

        const result = await res.json();

        if (result.ok && result.email) {
          setEmail(result.email);
        } else {
          toast.error("Session expired. Please request a new reset link.");
          router.push("/forgot-password");
        }
      } catch (error) {
        console.error(error);
        toast.error("Unable to retrieve email. Please try again.");
        router.push("/forgot-password");
      } finally {
        setLoading(false);
      }
    }

    fetchEmail();
  }, [router]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState({ isLoading: true, error: null });

    if (!email) {
      toast.error("Email not found. Please try again.");
      setAuthState({ isLoading: false, error: null });
      router.push("/forgot-password");
      return;
    }

    if (!data.token.trim()) {
      toast.error("Please enter the OTP sent to your email.");
      setAuthState({ isLoading: false, error: null });
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match.");
      setAuthState({ isLoading: false, error: null });
      return;
    }

    try {
      const resetPasswordPayload = {
        email,
        token: data.token,
        newPassword: data.newPassword,
      };

      console.log("resetPasswordPayload", resetPasswordPayload);

      const response = await AuthService.resetPassword(resetPasswordPayload);

      if (response?.success === true) {
        toast.success("Password updated successfully!");
        setAuthState({ isLoading: false, error: null });

        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        toast.error(
          response?.message || "Failed to update password. Please try again."
        );
        setAuthState({ isLoading: false, error: null });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while resetting password."
      );
      setAuthState({ isLoading: false, error: null });
    }
  };

  // Loading state
  if (loading) {
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
        <div className="relative z-10">
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If no email after loading, return null (will redirect)
  if (!email) {
    return null;
  }

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
        <AuthText />

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

              <h1 className="text-3xl md:text-5xl text-white font-medium">
                Create New Password
              </h1>
              <p className="mt-6 text-sm text-white/90 font-medium text-center">
                Set a new password for{" "}
                <span className="font-semibold text-orange">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-white">
              {/* OTP / Token */}
              <div className="relative w-full">
                <CustomInput
                  label="OTP"
                  id="token"
                  name="token"
                  type="text"
                  placeholder="Enter the 6-digit code"
                  value={data.token}
                  onChange={onChange}
                  required
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={6}
                  className="text-white placeholder:text-white/70"
                />
              </div>

              {/* Password */}
              <div className="relative w-full">
                <CustomInput
                  label="Password"
                  id="newPassword"
                  name="newPassword"
                  type={show.password ? "text" : "password"}
                  placeholder="Enter new password"
                  value={data.newPassword}
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
                >
                  {show.password ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative w-full">
                <CustomInput
                  label="Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type={show.confirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={data.confirmPassword}
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
                >
                  {show.confirm ? <EyeOff /> : <Eye />}
                </button>
                {!passwordsMatch && data.confirmPassword.length > 0 && (
                  <p className="mt-2 text-xs text-red-300">
                    Passwords do not match.
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="orange"
                className="w-full h-[52px]"
                disabled={authState.isLoading}
              >
                {authState.isLoading ? "Saving..." : "Save New Password"}
              </Button>

              <p className="flex items-center justify-center text-center text-sm text-white/90">
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
