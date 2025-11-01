"use client";

import { cn } from "@repo/ui/lib/utils";
import { type Dayjs } from "dayjs";
import { getWeekDays } from "../../../lib/calendar";

export function WeekDays({ selectedDate }: { selectedDate: Dayjs }) {
  return (
    <div className="grid border-b border-r py-2 border-gray-faint grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center">
      <div className="w-16 border-r border-gray-300">
        <div className="w-16 border-r border-gray-faint"></div>
      </div>
      {getWeekDays(selectedDate).map(({ currentDate, today }, index) => (
        <div
          key={index}
          className="flex text-sm font-normal space-x-1 flex-row items-center"
        >
          <div className={cn(today && "text-primary font-medium")}>
            {currentDate.format("ddd")}
          </div>
          <div
            className={cn("rounded-full", today && "text-primary font-medium")}
          >
            {currentDate.format("DD")}
          </div>
        </div>
      ))}
    </div>
  );
}
