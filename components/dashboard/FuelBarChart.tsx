"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FuelBarChartProps {
  title: string;
  data: number[];
  labels: string[];
  note?: string;
  availableYears?: number[];
  onYearChange?: (year: number) => void;
  maxValue?: number;
}

export function FuelBarChart({
  title,
  data,
  labels,
  note,
  availableYears = [2025],
  onYearChange,
  maxValue,
}: FuelBarChartProps) {
  const [selectedYear, setSelectedYear] = useState(availableYears[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Calculate dynamic max value and Y-axis steps
  const dataMax = data.length > 0 ? Math.max(...data) : 0;
  const calculatedMax = maxValue || Math.ceil((dataMax * 1.1) / 100) * 100; // Add 10% padding, round to nearest 100
  const step = calculatedMax / 5; // 5 intervals
  const yAxisValues = Array.from(
    { length: 6 },
    (_, i) => calculatedMax - i * step
  );

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
    onYearChange?.(year);
  };

  return (
    <div className="rounded-2xl bg-[#3B3835] p-6 text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>

        {/* Year Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((v) => !v)}
            className="flex items-center gap-1 text-xs bg-black/20 rounded px-3 py-1.5 opacity-80 hover:opacity-100 transition"
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
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />

              <div className="absolute right-0 top-full mt-2 bg-[#3C3933] border border-white/10 rounded-xl shadow-xl z-20 min-w-[120px] overflow-hidden">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                      selectedYear === year
                        ? "bg-[#FF8500]/20 text-[#FF8500]"
                        : "text-white/80 hover:bg-white/10"
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

      {/* Chart */}
      {data.length > 0 ? (
        <div className="relative mt-10 h-[520px]">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-white/50">
            {yAxisValues.map((v) => (
              <span key={v}>{Math.round(v)} L</span>
            ))}
          </div>

          {/* Grid lines */}
          {yAxisValues
            .slice()
            .reverse()
            .map((v) => (
              <div
                key={v}
                className="absolute left-10 right-0 border-t border-white/10"
                style={{ bottom: `${(v / calculatedMax) * 100}%` }}
              />
            ))}

          {/* Bars */}
          <div className="ml-10 grid grid-cols-12 gap-4 h-full items-end">
            {data.map((value, index) => {
              const percentage = Math.min(value / calculatedMax, 1);

              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 h-full"
                >
                  <div className="relative flex items-end justify-center h-full w-full group">
                    {/* Capacity bar */}
                    <div className="w-5 h-full bg-white rounded-full opacity-90" />

                    {/* Usage bar */}
                    <div
                      className="absolute bottom-0 w-5 bg-[#FF8500] rounded-full transition-all duration-300"
                      style={{ height: `${percentage * 100}%` }}
                    />

                    {/* Tooltip */}
                    <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-white text-black rounded-xl px-4 py-2 shadow-xl text-xs whitespace-nowrap">
                        <div className="font-semibold">
                          {value.toLocaleString()} Litres
                        </div>
                        <div className="text-black/50">
                          Used in {labels[index]}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Month label */}
                  {/* <span className="text-[11px] text-white/60">
                    {labels[index]}
                  </span> */}
                </div>
              );
            })}
          </div>

          <div className="ml-10 grid grid-cols-12 gap-4 h-full items-end">
            {data.map((value, index) => {
              // const percentage = Math.min(value / calculatedMax, 1);

              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 h-full"
                >
                  {/* Month label */}
                  <span className="text-[11px] text-white/60">
                    {labels[index]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="h-[520px] flex items-center justify-center">
          <span className="text-sm text-white/70">No data available</span>
        </div>
      )}

      {/* Footer note */}
      {note && (
        <div className="mt-6 text-xs text-white/80">
          <span className="inline-flex items-center rounded bg-black/20 px-3 py-1.5">
            {note}
          </span>
        </div>
      )}
    </div>
  );
}
