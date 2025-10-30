"use client";

import { cn } from "@repo/ui/lib/utils";
import { getHours } from "../../../lib/calendar";

export function WeekHours() {
  return (
    <div className="lg:w-16 border-r py-4 pl-3 border-gray-faint">
      {getHours.map((hour, index) => (
        <div key={index} className="relative w-full h-16">
          <div
            className={cn(
              "absolute font-mono font-medium text-xs text-zinc-500",
              index === 0 ? "top-0 hidden" : "-top-5"
            )}
          >
            {hour.format("HH:mm")}
          </div>
        </div>
      ))}
    </div>
  );
}
