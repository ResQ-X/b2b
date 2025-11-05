import { Suspense } from "react";
import SubAdminSignupPage from "@/components/auth/SubAdminSignup";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SubAdminSignupPage />
    </Suspense>
  );
}
