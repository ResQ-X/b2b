export function Tabs({
  value,
  onChange,
}: {
  value: "subscription" | "billing";
  onChange: (v: "subscription" | "billing") => void;
}) {
  return (
    <div className="w-full mt-6 text-[#FFFFFF]">
      <div className="flex items-center justify-between">
        <div className="w-full flex justify-between gap-8">
          <button
            onClick={() => onChange("subscription")}
            className={`w-1/2 h-10 pb-3 text-lg font-medium text-center ${
              value === "subscription" ? "text-[#FF8500]" : "text-white"
            }`}
          >
            Subscription
          </button>

          <button
            onClick={() => onChange("billing")}
            className={`w-1/2 h-10 pb-3 text-lg font-medium text-center ${
              value === "billing" ? "text-[#FF8500]" : "text-white"
            }`}
          >
            Transaction
          </button>
        </div>
      </div>

      {/* underline / progress bar */}
      <div className="h-[2px] w-full flex">
        <div
          className={`w-1/2 transition-colors duration-300 ${
            value === "subscription" ? "bg-[#FF8500]" : "bg-white"
          }`}
        />
        <div
          className={`w-1/2 transition-colors duration-300 ${
            value === "billing" ? "bg-[#FF8500]" : "bg-white"
          }`}
        />
      </div>
    </div>
  );
}
