"use client";

import { getHours } from "../../../lib/calendar";

export function WeekHours() {
  return (
    <div className="lg:w-16 border-r py-4 pl-3 border-gray-faint">
      {getHours.map((hour, index) => (
        <div key={index} className="relative w-full h-16">
          <div className="absolute font-mono font-medium text-xs text-zinc-500">
            {hour.format("HH:mm")}
          </div>
        </div>
      ))}
    </div>
  );
}
