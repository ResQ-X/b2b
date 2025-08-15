"use client";

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
  let acc = 0;
  const segments = slices
    .map((v, i) => {
      const start = (acc / total) * 360;
      acc += v;
      const end = (acc / total) * 360;
      return `${colors[i]} ${start}deg ${end}deg`;
    })
    .join(", ");

  // Calculate positions for percentage labels
  const getSegmentPosition = (sliceIndex: number) => {
    let accAngle = 0;
    for (let i = 0; i < sliceIndex; i++) {
      accAngle += (slices[i] / total) * 360;
    }
    const segmentAngle = (slices[sliceIndex] / total) * 360;
    const midAngle = accAngle + segmentAngle / 2;

    // Convert to radians and calculate position
    const rad = (midAngle - 90) * (Math.PI / 180); // -90 to start from top
    const radius = 100; // Distance from center (increased for bigger chart)
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
            style={{ background: `conic-gradient(${segments})` }}
          >
            {/* Inner circle to create donut effect - smaller inset for thicker ring */}
            <div className="absolute inset-14 rounded-full bg-[#2C2926]" />

            {/* Percentage labels positioned around the donut */}
            {slices.map((slice, index) => {
              const percentage = Math.round((slice / total) * 100);
              const position = getSegmentPosition(index);

              return (
                <div
                  key={index}
                  className="absolute text-white text-lg font-semibold"
                  style={{
                    left: `calc(50% + ${position.x}px)`,
                    top: `calc(50% + ${position.y}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {percentage}%
                </div>
              );
            })}
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
