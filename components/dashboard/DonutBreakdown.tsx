"use client";

import React from "react";

export function DonutBreakdown({
  title,
  slices, // e.g., [35,30,25,10]
  colors, // e.g., ["#FF8500", ...]
  legend,
}: {
  title: string;
  slices: number[];
  colors: string[];
  legend: { label: string; color: string }[];
}) {
  const total = slices.reduce((a, b) => a + b, 0);

  // Build conic-gradient only when there's data
  let acc = 0;
  const segments =
    total > 0
      ? slices
          .map((v, i) => {
            const start = (acc / total) * 360;
            acc += v;
            const end = (acc / total) * 360;
            const color = colors[i] ?? "#888888";
            return `${color} ${start}deg ${end}deg`;
          })
          .join(", ")
      : "";

  // Calculate positions for percentage labels (safe when total === 0)
  const getSegmentPosition = (sliceIndex: number) => {
    if (total === 0) return { x: 0, y: 0 };

    let accAngle = 0;
    for (let i = 0; i < sliceIndex; i++) {
      accAngle += (slices[i] / total) * 360;
    }
    const segmentAngle = (slices[sliceIndex] / total) * 360;
    const midAngle = accAngle + segmentAngle / 2;

    // Convert to radians and calculate position
    const rad = (midAngle - 90) * (Math.PI / 180); // -90 to start from top
    const radius = 100; // Distance from center (in px)
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;

    return { x, y };
  };

  return (
    <div className="border border-[#777777] rounded-2xl bg-[#3B3835] p-6 text-white">
      <h3 className="text-lg font-semibold mb-8">{title}</h3>

      <div className="flex flex-col items-center gap-8">
        {/* Donut Chart */}
        <div className="relative">
          <div
            className="relative h-64 w-64 rounded-full"
            style={{
              // if there's no data, show a subtle empty-ring background
              background:
                total > 0
                  ? `conic-gradient(${segments})`
                  : `radial-gradient(circle at center, #2C2926 60%, transparent 61%), conic-gradient(#444 0deg 360deg)`,
            }}
          >
            {/* Inner circle to create donut effect - smaller inset for thicker ring */}
            <div className="absolute inset-14 rounded-full bg-[#2C2926]" />

            {/* Percentage labels positioned around the donut */}
            {slices.map((slice, index) => {
              const percentage =
                total === 0 ? 0 : Math.round((slice / total) * 100);
              // Optionally hide labels for 0% slices
              if (percentage === 0) return null;

              const position = getSegmentPosition(index);

              return (
                <div
                  key={index}
                  className="absolute text-white text-lg font-semibold"
                  style={{
                    left: `calc(50% + ${position.x}px)`,
                    top: `calc(50% + ${position.y}px)`,
                    transform: "translate(-50%, -50%)",
                    // small pointer to keep labels readable
                    whiteSpace: "nowrap",
                  }}
                >
                  {percentage}%
                </div>
              );
            })}

            {/* Center text for empty state */}
            {total === 0 && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-sm font-medium opacity-80">No data</div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="w-full mt-20">
          <ul className="space-y-3">
            {legend.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <span
                  className="inline-block h-4 w-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-white text-base">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
