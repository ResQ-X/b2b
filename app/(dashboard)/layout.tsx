// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Cookies } from "react-cookie";
// import Head from "next/head";
// import { DashboardNav } from "@/components/ui/Nav";
// import { Sidebar } from "@/components/ui/Sidebar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     const cookies = new Cookies();
//     const accessToken = cookies.get("access_token");

//     if (!accessToken) {
//       router.replace("/login");
//     } else {
//       setIsAuthorized(true);
//     }
//   }, [router]);

//   // useEffect(() => {
//   //   if (!isAuthorized) return;

//   //   let timeout: NodeJS.Timeout;

//   //   const resetTimer = () => {
//   //     clearTimeout(timeout);
//   //     timeout = setTimeout(() => {
//   //       const cookies = new Cookies();
//   //       cookies.remove("accessToken");
//   //       cookies.remove("refreshToken");
//   //       cookies.remove("user");
//   //       router.push("/login");
//   //     }, 5 * 60 * 1000);
//   //   };

//   //   window.addEventListener("mousemove", resetTimer);
//   //   window.addEventListener("keydown", resetTimer);
//   //   resetTimer();

//   //   return () => {
//   //     window.removeEventListener("mousemove", resetTimer);
//   //     window.removeEventListener("keydown", resetTimer);
//   //     clearTimeout(timeout);
//   //   };
//   // }, [isAuthorized, router]);

//   if (!isAuthorized) return null;

//   return (
//     <>
//       <Head>
//         <title>Dashboard - ResqX Admin</title>
//         <meta
//           name="description"
//           content="ResqX Admin Dashboard - Emergency Response Management System"
//         />
//         <meta name="robots" content="noindex, nofollow" />
//         <link rel="icon" href="/favicon.ico" />
//         <meta name="theme-color" content="#3B3835" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         {/* Prevent caching for security */}
//         <meta
//           httpEquiv="Cache-Control"
//           content="no-cache, no-store, must-revalidate"
//         />
//         <meta httpEquiv="Pragma" content="no-cache" />
//         <meta httpEquiv="Expires" content="0" />
//       </Head>

//       <div className="flex h-screen bg-[#242220]">
//         {/* Sidebar for desktop */}
//         <div className="hidden md:flex">
//           <Sidebar />
//         </div>

//         {/* Sidebar for mobile */}
//         {sidebarOpen && (
//           <div className="fixed inset-0 z-50 flex md:hidden">
//             <div
//               className="fixed inset-0 bg-black/50"
//               onClick={() => setSidebarOpen(false)}
//             />
//             <div className="relative bg-[#3B3835] w-64 z-50">
//               <Sidebar onClose={() => setSidebarOpen(false)} />
//             </div>
//           </div>
//         )}

//         <div className="flex-1 flex flex-col">
//           <DashboardNav onMenuClick={() => setSidebarOpen(true)} />
//           <main className="flex-1 overflow-y-auto bg-[#242220] p-4 sm:p-8">
//             {children}
//           </main>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Cookies } from "react-cookie";
import Head from "next/head";
import axiosInstance from "@/lib/axios";
import { DashboardNav } from "@/components/ui/Nav";
import { Sidebar } from "@/components/ui/Sidebar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

/** ——————— Types for /fleet-subscription/me ——————— */
type PlanType = "REFUEL" | "FLEET" | "RESCUE";
type BillingCycle = "MONTHLY" | "ANNUAL";

interface MeResponse {
  success: boolean;
  data: {
    subscription: {
      id: string;
      plan_type: PlanType;
      billing_cycle: BillingCycle;
      expires_at: string;
    } | null;
    plan: {
      id: string;
      name: string;
    } | null;
  };
}

/** ——————— Simple “no plan” modal ——————— */
function PlanNudgeModal({
  onClose,
  onGoToPlans,
}: {
  onClose: () => void;
  onGoToPlans: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-[92vw] max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              No Active Plan
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              You don’t have an active subscription yet. Choose a plan to unlock
              refuel, fleet care, and rescue features.
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Not now
          </Button>
          <Button
            variant="orange"
            onClick={() => {
              onGoToPlans(); // navigate
              onClose(); // close modal right after navigation
            }}
          >
            Browse Plans
          </Button>
        </div>
      </div>
    </div>
  );
}

/** ——————— Helper: check active plan ——————— */
function hasActivePlan(payload: MeResponse["data"] | null): boolean {
  if (!payload?.subscription || !payload?.plan) return false;
  const exp = new Date(payload.subscription.expires_at).getTime();
  const now = Date.now();
  return Number.isFinite(exp) ? exp > now : true;
}

/** ——————— Layout ——————— */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  /** ——————— Auth check ——————— */
  useEffect(() => {
    const cookies = new Cookies();
    const accessToken = cookies.get("access_token");

    if (!accessToken) {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  /** ——————— Plan check ——————— */
  useEffect(() => {
    if (!isAuthorized) return;

    let alive = true;
    const checkPlan = async () => {
      try {
        const shouldNudge =
          localStorage.getItem("SHOW_PLAN_NUDGE") === "1" ||
          searchParams.get("subscribe") === "1";

        if (!shouldNudge) return;

        const res = await axiosInstance.get<MeResponse>(
          "/fleet-subscription/me"
        );
        const data = res.data?.data ?? null;

        if (!hasActivePlan(data) && alive) setShowPlanModal(true);
      } catch {
        // fail silently
      } finally {
        localStorage.removeItem("SHOW_PLAN_NUDGE");
      }
    };

    checkPlan();
    return () => {
      alive = false;
    };
  }, [isAuthorized, searchParams]);

  if (!isAuthorized) return null;

  return (
    <>
      <Head>
        <title>Dashboard - ResqX Admin</title>
        <meta
          name="description"
          content="ResqX Admin Dashboard - Emergency Response Management System"
        />
      </Head>

      <div className="flex h-screen bg-[#242220]">
        {/* Sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

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

      {/* Modal */}
      {showPlanModal && (
        <PlanNudgeModal
          onClose={() => setShowPlanModal(false)}
          onGoToPlans={() => router.push("/billing")}
        />
      )}
    </>
  );
}
