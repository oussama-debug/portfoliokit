"use client";

import { useCalendarStore } from "../lib/stores/calendar";

export function Assistant() {
  const { assist } = useCalendarStore();

  if (!assist) return null;

  return (
    <section className="hidden lg:flex flex-col min-w-[16rem] justify-start items-start border-gray-faint bg-zinc-50 min-h-screen"></section>
  );
}
