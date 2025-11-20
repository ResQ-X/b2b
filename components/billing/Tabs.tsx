export function Tabs({
  value,
  onChange,
  role,
}: {
  value: "subscription" | "billing" | "Overdraft";
  onChange: (v: "subscription" | "billing" | "Overdraft") => void;
  role?: string;
}) {
  const isUser = role === "USER";

  return (
    <div className="w-full mt-6 text-[#FFFFFF]">
      <div className="flex items-center justify-between">
        <div className="w-full flex justify-between gap-8">
          {/* Subscription tab - only for USER role */}
          {isUser && (
            <button
              onClick={() => onChange("subscription")}
              className={`w-1/3 h-10 pb-3 text-lg font-medium text-center ${
                value === "subscription" ? "text-[#FF8500]" : "text-white"
              }`}
            >
              Subscription
            </button>
          )}

          {/* Transaction tab - for all roles */}
          <button
            onClick={() => onChange("billing")}
            className={`${
              isUser ? "w-1/3" : "w-1/2"
            } h-10 pb-3 text-lg font-medium text-center ${
              value === "billing" ? "text-[#FF8500]" : "text-white"
            }`}
          >
            Transaction
          </button>

          {/* Overdraft tab - for all roles */}
          <button
            onClick={() => onChange("Overdraft")}
            className={`${
              isUser ? "w-1/3" : "w-1/2"
            } h-10 pb-3 text-lg font-medium text-center ${
              value === "Overdraft" ? "text-[#FF8500]" : "text-white"
            }`}
          >
            Overdraft
          </button>
        </div>
      </div>

      {/* underline / progress bar */}
      <div className="h-[2px] w-full flex">
        {/* Subscription underline - only for USER */}
        {isUser && (
          <div
            className={`w-1/3 transition-colors duration-300 ${
              value === "subscription" ? "bg-[#FF8500]" : "bg-white"
            }`}
          />
        )}

        {/* Transaction underline */}
        <div
          className={`${
            isUser ? "w-1/3" : "w-1/2"
          } transition-colors duration-300 ${
            value === "billing" ? "bg-[#FF8500]" : "bg-white"
          }`}
        />

        {/* Overdraft underline */}
        <div
          className={`${
            isUser ? "w-1/3" : "w-1/2"
          } transition-colors duration-300 ${
            value === "Overdraft" ? "bg-[#FF8500]" : "bg-white"
          }`}
        />
      </div>
    </div>
  );
}
