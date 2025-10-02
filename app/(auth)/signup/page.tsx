"use client";
import { toast } from "react-toastify";
import Image from "next/image";
import LogoSvg from "@/public/logo.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth.service";
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
    company_name: "",
    company_email: "",
    phone: "",
    company_phone: "",
    country: "NG",
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Remove all non-digits
      const digitsOnly = value.replace(/\D/g, "");

      let formattedPhone = "";

      if (digitsOnly.length > 0) {
        // If starts with 0, remove it and add +234
        if (digitsOnly.startsWith("0")) {
          formattedPhone = "+234" + digitsOnly.substring(1);
        }
        // If starts with 234, add + prefix
        else if (digitsOnly.startsWith("234")) {
          formattedPhone = "+" + digitsOnly;
        }
        // If doesn't start with 0 or 234, assume it's a local number and add +234
        else {
          formattedPhone = "+234" + digitsOnly;
        }
      }

      setFormData((p) => ({ ...p, phone: formattedPhone }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  const passwordsMatch = formData.password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState({ isLoading: true, error: null });

    if (!formData.password || formData.password.length < 8) {
      setAuthState({ isLoading: false, error: null });
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!passwordsMatch) {
      setAuthState({ isLoading: false, error: null });
      toast.error("Passwords do not match.");
      return;
    }

    if (!agreeToTerms) {
      setAuthState({ isLoading: false, error: null });
      toast.error(
        "Please agree to the Terms of Service and Privacy Policy to continue."
      );
      return;
    }

    const backendData = {
      name: formData.name,
      email: formData.email,
      company_name: formData.name,
      company_email: formData.email,
      phone: formData.phone,
      company_phone: formData.phone,
      country: formData.country,
      password: formData.password,
    };

    console.log("formData:", formData);
    try {
      const res = await AuthService.signup(backendData);

      if (res.success) {
        toast.success(
          res.message || "Account created! Please verify your email."
        );
        setAuthState({ isLoading: false, error: null });
        router.push("/subscription");
      } else {
        setAuthState({ isLoading: false, error: null });
        toast.error(res?.message || "An error occurred during signup");
      }
    } catch (error: any) {
      setAuthState({ isLoading: false, error: null });
      toast.error(
        error?.response?.data?.message || "An error occurred during signup"
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
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 w-full max-w-7xl flex items-center justify-around mx-auto">
        {/* Left: marketing text */}
        <AuthText />

        {/* Right: form card */}
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

              <h1 className="text-4xl md:text-5xl text-white font-semibold leading-[56px]">
                Welcome!
              </h1>
              <p className="mt-6 text-sm text-white/90 font-medium text-center">
                Let&#39;s get started, create an account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-white">
              {/* Company Name */}
              <div className="w-full">
                <CustomInput
                  label="Company's Name"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter Company's Name"
                  value={formData.name}
                  onChange={onChange}
                  required
                  className="text-white placeholder:text-white/70"
                />
              </div>

              {/* Company Email */}
              <div className="w-full">
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
              <div className="w-full">
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
              <div className="relative w-full">
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
              <div className="relative w-full">
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
              <div className="w-full">
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
                      href="#"
                      className="text-orange underline underline-offset-4 hover:opacity-80"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      className="text-orange underline underline-offset-4 hover:opacity-80"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="orange"
                className="w-full h-[52px]"
                disabled={authState.isLoading}
              >
                {authState.isLoading ? "Creating Account..." : "Sign Up"}
              </Button>

              {/* Switch to Login */}
              <p className="flex items-center justify-center text-center text-sm text-white/90">
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
