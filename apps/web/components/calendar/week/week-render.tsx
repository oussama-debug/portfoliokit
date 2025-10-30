"use client";

import { useEffect, useState } from "react";
import { dayjs, getHours, getWeekDays } from "../../../lib/calendar";
import { useCalendarStore } from "../../../lib/stores/calendar";
import { cn } from "@repo/ui/lib/utils";

export function WeekRender() {
  const { selectedDate } = useCalendarStore();
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {getWeekDays(selectedDate).map(({ isCurrentDay, today }, index) => {
        const dayDate = selectedDate.startOf("week").add(index, "day");

        return (
          <div key={index} className="relative border-r border-gray-faint">
            {getHours.map((hour, i) => (
              <div
                key={i}
                className="relative flex h-16 cursor-pointer flex-col items-center gap-y-2 hover:bg-primary/5"
                onClick={() => {}}
              ></div>
            ))}

            {isCurrentDay(dayDate) && today && (
              <div
                className={cn("absolute h-0.5 w-full bg-red-500")}
                style={{
                  top: `${(selectedDate.hour() / 24) * 100}%`,
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
