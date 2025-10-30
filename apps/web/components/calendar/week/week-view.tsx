"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { WeekDays } from "./week-days";
import { useCalendarStore } from "../../../lib/stores/calendar";

export function WeekView() {
  const { selectedDate } = useCalendarStore();
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full">
      <WeekDays selectedDate={selectedDate} />
    </section>
  );
}
