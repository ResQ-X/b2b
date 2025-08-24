"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import LogoSvg from "@/public/logo.svg";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AuthService } from "@/services/auth.service";
import { useAuth } from "@/contexts/auth.context";
import AuthImage from "@/public/auth-page.png";
import AuthText from "@/components/auth/auth-text";
import type { AuthState, LoginFormData } from "@/types/auth";
import CustomInput from "@/components/ui/CustomInput";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
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
    // router.push("/dashboard");
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
    <div
      className="relative flex min-h-screen w-full items-center justify-center"
      style={{
        backgroundImage: `url(${AuthImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Optional dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 w-full max-w-7xl flex justify-around mx-auto">
        <AuthText />

        <div className="flex w-full flex-col justify-center max-w-[600px] px-4 sm:px-6 xl:px-12">
          <div className="mx-auto w-full flex justify-center flex-col max-w-lg">
            <div className="mb-8 flex items-center flex-col">
              <div className="w-[181px] h-[70px] relative mb-8">
                <Image
                  src={LogoSvg}
                  alt="RESQ-X Logo"
                  fill
                  className="w-[181px] h-[34px]"
                  priority
                />
              </div>
              <h1 className="text-5xl text-[#ffff] font-medium">Sign In</h1>
              <p className="mt-8 text-[13px] text-[#ffff] font-medium">
                Authorized Personnel: Sign in to access the dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-[#ffff]">
              <div className="space-y-2 relative w-full max-w-lg">
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

              <div className="space-y-2 relative w-full max-w-lg">
                <CustomInput
                  label="Password"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-[60%] -translate-y-1/2 text-dark focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="text-white" />
                  ) : (
                    <Eye className="text-white" />
                  )}
                </button>
              </div>

              <div className="text-end text-sm font-medium text-[#ffff]">
                <Button
                  variant="link"
                  className="text-[#ffff] hover:text-orange/80"
                  onClick={() => router.push("/forgot-password")}
                >
                  Forgot password?
                </Button>
              </div>

              {authState.error && (
                <p className="text-sm text-red-500">{authState.error}</p>
              )}

              <Button
                type="submit"
                className="w-full max-w-lg h-[60px] bg-orange hover:bg-opacity-80 hover:scale-105 transition-all hover:bg-orange duration-200"
                disabled={authState.isLoading}
              >
                {authState.isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-center text-sm text-[#ffff]">
                Don&apos;t have an account?{" "}
                <Button
                  variant="link"
                  className="text-orange hover:text-orange/80"
                  onClick={() => router.push("/signup")}
                >
                  Sign Up
                </Button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
