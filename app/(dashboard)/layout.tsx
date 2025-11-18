"use client";
import { useEffect, useState, Suspense } from "react";
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

/** ——————— Simple "no plan" modal ——————— */
export function PlanNudgeModal({
  onClose,
  onGoToPlans,
}: {
  onClose: () => void;
  onGoToPlans: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className="relative w-11/12 lg:w-[547px] rounded-2xl bg-[#3B3835] p-6 text-center text-white shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-white/80" />
        </button>

        {/* Modal content */}
        <h2 className="text-2xl font-semibold">No Active Plan</h2>
        <p className="my-9 text-lg font-medium text-white/80">
          You don’t have an active subscription yet. Choose a plan to unlock
          refuel, fleet care, and rescue features.
        </p>

        {/* Buttons */}
        <div className="my-8 flex flex-col lg:flex-row justify-between gap-4">
          <Button
            variant="grey"
            onClick={onClose}
            className="w-full lg:w-[224px] h-[48px] lg:h-[52px]"
          >
            Not Now
          </Button>
          <Button
            variant="orange"
            onClick={onGoToPlans}
            className="w-full lg:w-[224px] h-[48px] lg:h-[52px]"
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

/** ——————— Layout Content (uses useSearchParams) ——————— */
function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
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

      <div className="flex min-h-screen bg-[#242220]">
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
          onGoToPlans={async () => {
            await router.push("/billing");
            setShowPlanModal(false);
          }}
        />
      )}
    </>
  );
}

/** ——————— Main Layout with Suspense Boundary ——————— */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#242220]">
          <div className="text-white text-lg">Loading...</div>
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
