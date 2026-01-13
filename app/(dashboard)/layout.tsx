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

/* ————— Types (MATCH NEW BACKEND EXACTLY) ————— */
type PlanType = "REFUEL" | "FLEET" | "RESCUE";
type BillingCycle = "MONTHLY" | "ANNUAL";

interface Subscription {
  id: string;
  business_id: string;
  plan_type: PlanType;
  billing_cycle: BillingCycle;
  category: string;
  plan_id: string;
  asset_count: number;
  price_total: string;
  starts_at: string;
  expires_at: string;
  remaining_uses: number | null;
  last_reset_at: string | null;
  created_at: string;
  updated_at: string;
  paystack_plan_code: string | null;
  paystack_subscription_code: string | null;
  paystack_email_token: string | null;
  isActive: boolean;
}

interface MeResponse {
  success: boolean;
  data: Subscription | null;
}

/* ————— No-plan modal ————— */
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

/* ————— Active plan check (NEW BACKEND LOGIC) ————— */
function hasActivePlan(sub: Subscription | null): boolean {
  if (!sub) return false;

  // Prefer backend truth
  if (typeof sub.isActive === "boolean") {
    return sub.isActive;
  }

  // Fallback safety
  return new Date(sub.expires_at).getTime() > Date.now();
}

/* ————— Layout Content ————— */
function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  /* ——— Auth check ——— */
  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("access_token");

    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  /* ——— Plan check ——— */
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

        const subscription = res.data?.data ?? null;

        console.log("Subscription check:", subscription);

        if (alive && !hasActivePlan(subscription)) {
          setShowPlanModal(true);
        }
      } catch {
        // silent
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
      </Head>

      <div className="flex min-h-screen bg-[#242220]">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative z-50 w-64 bg-[#3B3835]">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col md:ml-[242px]">
          <DashboardNav onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-[#242220] p-4 sm:p-8">
            {children}
          </main>
        </div>
      </div>

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

/* ————— Suspense Wrapper ————— */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#242220]">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
