"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cookies } from "react-cookie";
import { DashboardNav } from "@/components/dashboard/nav";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const cookies = new Cookies();
    const accessToken = cookies.get("accessToken");

    if (!accessToken) {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthorized) return;

    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const cookies = new Cookies();
        cookies.remove("accessToken");
        cookies.remove("refreshToken");
        cookies.remove("user");
        router.push("/login");
      }, 5 * 60 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(timeout);
    };
  }, [isAuthorized, router]);

  if (!isAuthorized) return null;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardNav />
        <main className="flex-1 overflow-y-auto bg-lighter p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
