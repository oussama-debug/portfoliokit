"use client";

import { WeekDays } from "./week-days";
import { useCalendarStore } from "../../../lib/stores/calendar";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { WeekHours } from "./week-hours";
import { WeekRender } from "./week-render";
import { cn } from "@repo/ui/lib/utils";

export function WeekView() {
  const { selectedDate } = useCalendarStore();

  return (
    <section className="w-full min-h-[calc(100vh-45px)]">
      <WeekDays selectedDate={selectedDate} />
      <ScrollArea className={"w-full relative lg:h-[calc(100vh-81px)]"}>
        {/*<div
          className={cn(
            "grid fixed z-50 grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr]",
            "cursor-not-allowed bg-zinc-50 w-full border-b border-gray-faint"
          )}
          style={{ minHeight: `26px` }}
        >
         @TODO: ici je mets les all days 
        </div>*/}
        <div
          className={cn(
            "grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
            //"mt-6.5"
          )}
          style={{ minHeight: `${24 * 64}px` }}
        >
          <WeekHours />
          <WeekRender />
        </div>
      </ScrollArea>
    </section>
  );
}
