"use client";
import Image from "next/image";
import LogoSvg from "@/public/logo.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
// import { AuthService } from "@/services/auth.service";
import { useState } from "react";
import AuthImage from "@/public/auth-page.png";
import AuthText from "@/components/auth/auth-text";
import type { AuthState, SignupFormData } from "@/types/auth";
import { Eye, EyeOff } from "lucide-react";
import CustomInput from "@/components/ui/CustomInput";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    country: "",
    phone: "",
    userType: "ADMIN",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // keep digits and a leading +
      const cleaned = value.replace(/[^\d+]/g, "");
      setFormData((p) => ({ ...p, phone: cleaned }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  const passwordsMatch = formData.password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setAuthState({ isLoading: true, error: null });

    if (!/@resqx\.ng$/i.test(formData.email)) {
      setAuthState({
        isLoading: false,
        error: "Only @resqx.ng email addresses are allowed",
      });
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      setAuthState({
        isLoading: false,
        error: "Password must be at least 8 characters.",
      });
      return;
    }

    if (!passwordsMatch) {
      setAuthState({
        isLoading: false,
        error: "Passwords do not match.",
      });
      return;
    }

    if (!agreeToTerms) {
      setAuthState({
        isLoading: false,
        error:
          "Please agree to the Terms of Service and Privacy Policy to continue.",
      });
      return;
    }
    router.push("/subscription");
    // try {
    //   const res = await AuthService.signup({ ...formData });

    //   if (res.success) {
    //     setSuccessMsg(
    //       res.message || "Account created! Please verify your email."
    //     );
    //     setAuthState({ isLoading: false, error: null });
    //     // router.push(
    //     //   `/verify-email?email=${encodeURIComponent(formData.email)}`
    //     // );
    //     router.push("/subscription");
    //   } else {
    //     setAuthState({
    //       isLoading: false,
    //       error: res?.message || "An error occurred during signup",
    //     });
    //   }
    // } catch (error: any) {
    //   setAuthState({
    //     isLoading: false,
    //     error:
    //       error?.response?.data?.message || "An error occurred during signup",
    //   });
    // }
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
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 w-full max-w-7xl flex justify-around items-center mx-auto">
        {/* Left: marketing text */}
        <AuthText />

        {/* Right: form card */}
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

              <h1 className="text-4xl md:text-5xl text-white font-semibold leading-[56px]">
                Welcome!
              </h1>
              <p className="mt-6 text-sm text-white/90 font-medium text-center">
                Let’s get started, create an account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-white">
              {/* Company Name */}
              <div className="w-full max-w-[500px]">
                <CustomInput
                  label="Company’s Name"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter Company’s Name"
                  value={formData.name}
                  onChange={onChange}
                  required
                  className="text-white placeholder:text-white/70"
                />
              </div>

              {/* Company Email */}
              <div className="w-full max-w-[500px]">
                <CustomInput
                  label="Company Email Address"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Email Address"
                  value={formData.email}
                  onChange={onChange}
                  required
                  className="text-white placeholder:text-white/70"
                />
              </div>

              {/* Phone */}
              <div className="w-full max-w-[500px]">
                <CustomInput
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={onChange}
                  required
                  className="text-white placeholder:text-white/70"
                />
              </div>

              {/* Password */}
              <div className="relative w-full max-w-[500px]">
                <div className="relative w-full">
                  <CustomInput
                    label="Password"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password must be 8 characters long"
                    value={formData.password}
                    onChange={onChange}
                    required
                    className="pr-12 text-white placeholder:text-white/70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-[70%] -translate-y-1/2 text-white/90"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
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
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-12 text-white placeholder:text-white/70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-4 top-[70%] -translate-y-1/2 text-white/90"
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirm ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {!passwordsMatch && confirmPassword.length > 0 && (
                  <p className="mt-2 text-xs text-red-300">
                    Passwords do not match.
                  </p>
                )}
              </div>

              {/* Terms checkbox + copy */}
              <div className="w-full max-w-[500px]">
                <label className="flex items-start gap-3 text-sm text-white/90 select-none">
                  <input
                    type="checkbox"
                    className="orange-checkbox mt-1 h-4 w-4 rounded border border-orange bg-transparent focus:outline-none"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                  />
                  <span>
                    By using ResQ-X, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-orange underline underline-offset-4 hover:opacity-80"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-orange underline underline-offset-4 hover:opacity-80"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
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
                className="w-full max-w-lg h-[60px] bg-orange hover:bg-opacity-80 hover:scale-105 transition-all hover:bg-orange duration-200"
                disabled={authState.isLoading || !agreeToTerms}
              >
                {authState.isLoading ? "Creating Account..." : "Sign Up"}
              </Button>

              {/* Switch to Login */}
              <p className="text-center text-sm text-white/90">
                Already have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-orange hover:text-orange/80"
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </Button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
