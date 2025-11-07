"use client";

import React, { useState } from "react";

export function DonutBreakdown({
  title,
  slices, // e.g., [35,30,25,10]
  colors, // e.g., ["#FF8500", ...]
  legend,
}: {
  title: string;
  slices: number[];
  colors: string[];
  legend: { label: string; value: string; color: string }[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = slices.reduce((a, b) => a + b, 0);

  // Build segments for the conic gradient
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

  // Calculate positions for percentage labels
  const getSegmentPosition = (sliceIndex: number) => {
    if (total === 0) return { x: 0, y: 0 };

    let accAngle = 0;
    for (let i = 0; i < sliceIndex; i++) {
      accAngle += (slices[i] / total) * 360;
    }
    const segmentAngle = (slices[sliceIndex] / total) * 360;
    const midAngle = accAngle + segmentAngle / 2;

    const rad = (midAngle - 90) * (Math.PI / 180);
    const radius = 100;
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;

    return { x, y };
  };

  // Create interactive segments for hover detection
  const createSegmentPath = (sliceIndex: number) => {
    if (total === 0) return "";

    let accAngle = 0;
    for (let i = 0; i < sliceIndex; i++) {
      accAngle += (slices[i] / total) * 360;
    }
    const segmentAngle = (slices[sliceIndex] / total) * 360;

    const startAngle = (accAngle - 90) * (Math.PI / 180);
    const endAngle = (accAngle + segmentAngle - 90) * (Math.PI / 180);

    const outerRadius = 128; // Half of 256px (chart size)
    const innerRadius = 56; // Size of inner circle (inset-14 = 56px)

    // Calculate outer arc points
    const x1 = 128 + outerRadius * Math.cos(startAngle);
    const y1 = 128 + outerRadius * Math.sin(startAngle);
    const x2 = 128 + outerRadius * Math.cos(endAngle);
    const y2 = 128 + outerRadius * Math.sin(endAngle);

    // Calculate inner arc points
    const x3 = 128 + innerRadius * Math.cos(endAngle);
    const y3 = 128 + innerRadius * Math.sin(endAngle);
    const x4 = 128 + innerRadius * Math.cos(startAngle);
    const y4 = 128 + innerRadius * Math.sin(startAngle);

    const largeArc = segmentAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;
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
              background:
                total > 0
                  ? `conic-gradient(${segments})`
                  : `radial-gradient(circle at center, #2C2926 60%, transparent 61%), conic-gradient(#444 0deg 360deg)`,
            }}
          >
            {/* Inner circle to create donut effect */}
            <div className="absolute inset-14 rounded-full bg-[#2C2926]" />

            {/* SVG overlay for hover detection */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 256 256"
            >
              {slices.map((slice, index) => {
                const percentage =
                  total === 0 ? 0 : Math.round((slice / total) * 100);
                if (percentage === 0) return null;

                return (
                  <path
                    key={index}
                    d={createSegmentPath(index)}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>

            {/* Percentage labels - only show on hover */}
            {hoveredIndex !== null && slices[hoveredIndex] > 0 && (
              <div
                className="absolute text-white text-lg font-semibold pointer-events-none"
                style={{
                  left: `calc(50% + ${getSegmentPosition(hoveredIndex).x}px)`,
                  top: `calc(50% + ${getSegmentPosition(hoveredIndex).y}px)`,
                  transform: "translate(-50%, -50%)",
                  whiteSpace: "nowrap",
                }}
              >
                {Math.round((slices[hoveredIndex] / total) * 100)}%
              </div>
            )}

            {/* Center text for empty state */}
            {total === 0 && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-sm font-medium opacity-80">No data</div>
              </div>
            )}
          </div>
        </div>

        {/* Legend with percentages */}
        <div className="w-full mt-20">
          <ul className="space-y-3">
            {legend.map((item, index) => (
              <li
                key={item.label}
                className="flex items-center gap-3 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span
                  className="inline-block h-4 w-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-white text-base flex-1">
                  {item.label}
                </span>
                <span className="text-white/80 text-sm">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* <div className="w-full mt-20">
          <ul className="space-y-5">
            {legend.map((item, index) => (
              <li
                key={item.label}
                className="border border-white/10 rounded-xl p-4 hover:bg-[#2C2926]/60 transition-all"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="inline-block h-4 w-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white font-medium text-base flex-1">
                    {item.label}
                  </span>
                  <span className="text-white/80 text-sm">{item.value}</span>
                </div>

     
                {item.details && (
                  <div className="grid grid-cols-2 gap-y-1 text-sm text-white/80 pl-7">
                    <div>🚗 Fuel Orders:</div>
                    <div className="text-right">{item.details.fuel_orders}</div>

                    <div>🛠 Maintenance:</div>
                    <div className="text-right">
                      {item.details.maintenance_orders}
                    </div>

                    <div>⚡ Emergency:</div>
                    <div className="text-right">
                      {item.details.emergency_orders}
                    </div>

                    <div className="font-medium text-white mt-1">Total:</div>
                    <div className="text-right font-semibold text-white mt-1">
                      {item.details.total_orders}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    </div>
  );
}
