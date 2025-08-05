"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useLoading } from "@/providers/loading-providers";

export function SplashScreen() {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, setIsLoading]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-64 h-24 relative">
          <Image
            src="/ressqx.png"
            alt="RESQ-X Logo"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      <footer className="text-sm text-gray-500">
        © 2025 RESQ-X. All Rights Reserved.
      </footer>
    </div>
  );
}
