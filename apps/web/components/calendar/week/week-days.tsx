"use client";

import { cn } from "@repo/ui/lib/utils";
import { type Dayjs } from "dayjs";
import { getWeekDays } from "../../../lib/calendar";

export function WeekDays({ selectedDate }: { selectedDate: Dayjs }) {
  return (
    <div className="grid py-2 border-b border-gray-faint grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center">
      <div className="w-16 border-r border-gray-300">
        {/** ici je mets les différents calendriers, timezones, etc */}
      </div>
      {getWeekDays(selectedDate).map(({ currentDate, today }, index) => (
        <div
          key={index}
          className="flex text-sm font-medium space-x-1 flex-row items-center"
        >
          <div className={cn(today && "text-primary")}>
            {currentDate.format("ddd")}
          </div>
          <div className={cn("rounded-full", today && "text-primary")}>
            {currentDate.format("DD")}
          </div>
        </div>
      ))}
    </div>
  );
}
