"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cookies } from "react-cookie";
import Head from "next/head";
import { DashboardNav } from "@/components/ui/Nav";
import { Sidebar } from "@/components/ui/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const cookies = new Cookies();
    const accessToken = cookies.get("access_token");

    if (!accessToken) {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // useEffect(() => {
  //   if (!isAuthorized) return;

  //   let timeout: NodeJS.Timeout;

  //   const resetTimer = () => {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(() => {
  //       const cookies = new Cookies();
  //       cookies.remove("accessToken");
  //       cookies.remove("refreshToken");
  //       cookies.remove("user");
  //       router.push("/login");
  //     }, 5 * 60 * 1000);
  //   };

  //   window.addEventListener("mousemove", resetTimer);
  //   window.addEventListener("keydown", resetTimer);
  //   resetTimer();

  //   return () => {
  //     window.removeEventListener("mousemove", resetTimer);
  //     window.removeEventListener("keydown", resetTimer);
  //     clearTimeout(timeout);
  //   };
  // }, [isAuthorized, router]);

  if (!isAuthorized) return null;

  return (
    <>
      <Head>
        <title>Dashboard - ResqX Admin</title>
        <meta
          name="description"
          content="ResqX Admin Dashboard - Emergency Response Management System"
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3B3835" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Prevent caching for security */}
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </Head>

      <div className="flex h-screen bg-[#242220]">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Sidebar for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative bg-[#3B3835] w-64 z-50">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <DashboardNav onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-[#242220] p-4 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
