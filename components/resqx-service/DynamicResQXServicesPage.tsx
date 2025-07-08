"use client";
import dynamic from "next/dynamic";

const ResQXServicesPage = dynamic(() => import("./ResQXServicesPage"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#fff] p-8 md:p-16 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#FF8500] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  ),
});

export default ResQXServicesPage;
