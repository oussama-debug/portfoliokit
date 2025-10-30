"use client";

import { WeekDays } from "./week-days";
import { useCalendarStore } from "../../../lib/stores/calendar";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { WeekHours } from "./week-hours";
import { WeekRender } from "./week-render";

export function WeekView() {
  const { selectedDate } = useCalendarStore();

  return (
    <section className="w-full min-h-[calc(100vh-45px)]">
      <WeekDays selectedDate={selectedDate} />
      <ScrollArea className={"w-full lg:h-[calc(100vh-81px)]"}>
        <div
          className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
          style={{ minHeight: `${24 * 64}px` }}
        >
          <WeekHours />
          <WeekRender />
        </div>
      </ScrollArea>
    </section>
  );
}
