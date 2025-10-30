"use client";

import { Button } from "@repo/ui/components/button";
import { Group, GroupItem } from "@repo/ui/components/group";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendarStore } from "../../lib/stores/calendar";

export function CalendarHeader() {
  const { selectedDate, view, reset, nextWeek, previousWeek } =
    useCalendarStore();

  return (
    <div className="w-full lg:px-4 bg-primary-foreground space-x-2 py-2 flex flex-row justify-between items-center">
      <div className="flex space-x-3 items-center justify-center">
        <span className="font-sans min-w-[115px] font-semibold text-sm">
          {selectedDate.format("MMMM Do")}
        </span>
        <Group>
          <GroupItem
            render={
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => {
                  if (view === "week") {
                    previousWeek();
                  }
                }}
              />
            }
          >
            <ChevronLeft strokeWidth={2.5} />
          </GroupItem>
          <GroupItem
            render={
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => {
                  if (view === "week") {
                    nextWeek();
                  }
                }}
              />
            }
          >
            <ChevronRight strokeWidth={2.5} />
          </GroupItem>
          <GroupItem
            render={
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => {
                  reset();
                }}
              />
            }
          >
            Today
          </GroupItem>
        </Group>
      </div>
      <div>
        <Button size={"sm"} variant={"ghost"}>
          Share
        </Button>
      </div>
    </div>
  );
}
