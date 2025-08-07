"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/auth.service";
import type { AuthState, SignupFormData } from "@/types/auth";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    country: "",
    phone: "",
    userType: "ADMIN",
    // userType: "ADMIN" | "CUSTOMER_SUPPORT" | "OPERATION_MANAGER";
    password: "",
  });
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState({ isLoading: true, error: null });

    console.log("Form Data:", formData);

    if (!/@resqx\.ng$/i.test(formData.email)) {
      setAuthState({
        isLoading: false,
        error: "Only @resqx.ng email addresses are allowed",
      });
      return;
    }

    try {
      const response = await AuthService.signup(formData);
      if (response.success) {
        router.push(`/verify-email?email=${formData.email}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setAuthState({
        isLoading: false,
        error:
          error.response?.data?.message || "An error occurred during signup",
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
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-7xl flex justify-around mx-auto">
        <div className="flex w-full flex-col justify-center max-w-[488px] px-4 sm:px-6 xl:px-12">
          <div className="mx-auto w-full flex justify-center flex-col max-w-sm">
            <div className="mb-8 flex items-center flex-col">
              <div className="w-[181px] h-[70px] relative mb-8">
                <Image
                  src="/ressqx.png"
                  alt="RESQ-X Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="text-5xl text-dark-brown font-medium">
                Create Account
              </h1>
              <p className="mt-4 text-[13px] text-dark font-medium">
                Join our team of authorized personnel.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="name"
                  className="w-full max-w-[400px] bg-orange bg-opacity-5 focus:ring-none focus:outline-none focus:border-orange h-[60px] rounded-[10px] border border-beige"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  placeholder="Full Name"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="email"
                  className="w-full max-w-[400px] bg-orange bg-opacity-5 focus:ring-none focus:outline-none focus:border-orange h-[60px] rounded-[10px] border border-beige"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  placeholder="Email"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="country"
                  className="w-full max-w-[400px] bg-orange bg-opacity-5 focus:ring-none focus:outline-none focus:border-orange h-[60px] rounded-[10px] border border-beige"
                  name="country"
                  type="text"
                  required
                  value={formData.country}
                  placeholder="Country"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="phone"
                  className="w-full max-w-[400px] bg-orange bg-opacity-5 focus:ring-none focus:outline-none focus:border-orange h-[60px] rounded-[10px] border border-beige"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  placeholder="Phone Number"
                  onChange={handleChange}
                />
              </div>

              {/* <div className="space-y-2">
                <Input
                  id="password"
                  name="password"
                  className="w-full max-w-[400px] bg-orange bg-opacity-5 focus:ring-none focus:outline-none focus:border-orange h-[60px] rounded-[10px] border border-beige"
                  type="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div> */}

              <div className="relative w-full max-w-[400px]">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-orange bg-opacity-5 h-[60px] rounded-[10px] border border-beige pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* <div className="space-y-2">
                <Label>User Type</Label>
                <RadioGroup
                  defaultValue="ADMIN"
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      userType: value as "ADMIN",
                    }))
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ADMIN" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CUSTOMER" id="customer" />
                    <Label htmlFor="customer">Customer</Label>
                  </div>
                </RadioGroup>
              </div> */}

              {authState.error && (
                <p className="text-sm text-red-500">{authState.error}</p>
              )}

              <Button
                type="submit"
                className="w-full max-w-[400px] h-[60px] bg-orange hover:bg-opacity-80 hover:scale-105 transition-all hover:bg-orange duration-200"
                disabled={authState.isLoading}
              >
                {authState.isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Button
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

        <div className="relative hidden w-full max-w-[600px] h-[602px] lg:block rounded-3xl overflow-hidden">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="/resqman.jpeg"
            alt="Background"
            width={1200}
            height={800}
            priority
          />

          <div className="absolute inset-0 bg-black/60 z-10" />

          <div className="absolute inset-0 z-20 flex flex-col justify-center p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">
              Join our administrative team.
            </h2>
            <p className="text-lg max-w-xl">
              Be part of our mission to enhance efficiency and improve response
              times for seamless operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
