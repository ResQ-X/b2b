"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FuelBarChart({
  title,
  data,
  labels,
  note,
  availableYears = [2023, 2024, 2025],
  onYearChange,
}: {
  title: string;
  data: number[];
  labels: string[];
  note?: string;
  availableYears?: number[];
  onYearChange?: (year: number) => void;
}) {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const max = Math.max(...data, 1);
  const chartHeight = 480; // Fixed height in pixels

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
    onYearChange?.(year);
  };

  return (
    <div className="rounded-2xl bg-[#3B3835] p-6 text-white">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>

        {/* Year Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity bg-black/20 rounded px-2 py-1"
          >
            <span>Monthly · {selectedYear}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 bg-[#3C3933] rounded-lg shadow-lg border border-white/10 z-20 min-w-[120px]">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      selectedYear === year
                        ? "bg-[#FF8500]/20 text-[#FF8500]"
                        : "text-white/80"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="my-10 h-[482px]">
        {/* Chart container with fixed height */}
        <div
          className="grid grid-cols-12 gap-2 items-end"
          style={{ height: `${chartHeight}px` }}
        >
          {data.map((value, index) => {
            const barHeight = (value / max) * chartHeight;
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 h-full"
              >
                {/* Bar container that takes full height and aligns bar to bottom */}
                <div className="flex-1 flex items-end justify-center w-full">
                  <div
                    className="w-4 rounded-t-md bg-[#FF8500] transition-all duration-300 hover:bg-[#FF9500] cursor-pointer relative group"
                    style={{
                      height: `${barHeight}px`,
                      minHeight: value > 0 ? "2px" : "0px",
                    }}
                    title={`${labels[index]}: ${value}L`}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {value}L
                    </div>
                  </div>
                </div>
                {/* Label */}
                <span className="text-[11px] text-white/70 text-center">
                  {labels[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {note && (
        <div className="mt-4 text-xs text-white/80">
          <span className="inline-flex items-center rounded bg-black/20 px-2 py-1">
            {note}
          </span>
        </div>
      )}
    </div>
  );
}
