"use client";
import { toast } from "react-toastify";
import Image from "next/image";
import LogoSvg from "@/public/logo.svg";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth.service";
import { useEffect, useState } from "react";
import AuthImage from "@/public/auth-page.png";
import AuthText from "@/components/auth/auth-text";
import type { AuthState, SubAdminSignupFormData } from "@/types/auth";
import { Eye, EyeOff } from "lucide-react";
import CustomInput from "@/components/ui/CustomInput";

export default function SubAdminSignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<SubAdminSignupFormData>({
    name: "",
    phone: "",
    password: "",
    token: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) {
      setFormData((p) => ({ ...p, token: t }));
    } else {
      toast.info(
        "No invite token found in the link. Paste your token to continue."
      );
    }
  }, [searchParams]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!value) {
        setFormData((p) => ({ ...p, phone: "" }));
        return;
      }

      const digitsOnly = value.replace(/\D/g, "");
      let formatted = value;

      if (digitsOnly.startsWith("234")) {
        const local10 = digitsOnly.slice(3, 13);
        formatted = `+234${local10}`;
      } else {
        const local11 = digitsOnly.slice(0, 11);
        formatted = local11;
      }

      setFormData((p) => ({ ...p, phone: formatted }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  const passwordsMatch = formData.password === confirmPassword;

  const isStrongPassword = (pwd: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState({ isLoading: true, error: null });

    if (!formData.token?.trim()) {
      setAuthState({ isLoading: false, error: null });
      toast.error(
        "Invitation token is missing. Use the email link or paste your token."
      );
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setAuthState({ isLoading: false, error: null });
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character."
      );
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

    let normalizedPhone = formData.phone.trim();
    if (/^0\d{10}$/.test(normalizedPhone)) {
      normalizedPhone = `+234${normalizedPhone.slice(1)}`;
    } else if (/^234\d{10}$/.test(normalizedPhone)) {
      normalizedPhone = `+${normalizedPhone}`;
    }

    const backendData = {
      name: formData.name,
      phone: normalizedPhone,
      password: formData.password,
      token: formData.token, // ✅ includes token from URL (or pasted)
    };

    try {
      const res = await AuthService.subadminsignup(backendData);
      if (res.success) {
        toast.success(res.message || "Account created successfully.");
        setAuthState({ isLoading: false, error: null });
        router.push("login");
      } else {
        setAuthState({ isLoading: false, error: null });
        toast.error(res?.message || "An error occurred during signup");
      }
    } catch (error: any) {
      console.log("Error:", error?.response?.data?.message);
      setAuthState({ isLoading: false, error: null });
      const errorMessage = error?.response?.data?.message;
      toast.error(
        (Array.isArray(errorMessage) ? errorMessage[0] : errorMessage) ||
          "An error occurred during signup"
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

              <h1 className="text-4xl md:text-5xl text-white font-semibold leading-[56px]">
                Welcome!
              </h1>
              <p className="mt-6 text-sm text-white/90 font-medium text-center">
                Sign up to access your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-white">
              {/* Name */}
              <CustomInput
                label="Name"
                id="name"
                name="name"
                type="text"
                placeholder="Enter First Name"
                value={formData.name}
                onChange={onChange}
                required
                className="text-white placeholder:text-white/70"
              />

              {/* Phone */}
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
                maxLength={14}
              />

              {/* Password */}
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
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Confirm Password */}
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
                >
                  {showConfirm ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {!passwordsMatch && confirmPassword.length > 0 && (
                <p className="text-xs text-red-300">Passwords do not match.</p>
              )}

              {/* Token field (readonly if present via URL; editable if missing) */}
              {/* <CustomInput
                label="Invitation Token"
                id="token"
                name="token"
                type="text"
                placeholder="Auto-filled from email link, or paste token"
                value={formData.token}
                onChange={onChange}
                required
                readOnly={!!formData.token} // user can still paste if empty
                className={`text-white placeholder:text-white/70 ${
                  formData.token ? "opacity-75 cursor-not-allowed" : ""
                }`}
              /> */}

              {/* Terms */}
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
                    href="https://www.resqx.ng/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange underline underline-offset-4 hover:opacity-80"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="https://www.resqx.ng/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange underline underline-offset-4 hover:opacity-80"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Submit */}
              <Button
                type="submit"
                variant="orange"
                className="w-full h-[52px]"
                disabled={authState.isLoading}
              >
                {authState.isLoading ? "Creating Account..." : "Sign Up"}
              </Button>

              {/* Switch */}
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
