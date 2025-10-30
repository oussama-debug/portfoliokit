"use client";

import { Button } from "@repo/ui/components/button";
import { PlusIcon, SidebarIcon } from "lucide-react";

export function Sidebar() {
  return (
    <section className="hidden lg:flex flex-col min-w-[16rem] justify-start items-start border-r border-gray-faint bg-slate-50 min-h-screen">
      <div className="py-1.5 w-full flex justify-between items-center lg:px-4">
        <Button size={"icon"} variant={"ghost"}>
          <SidebarIcon />
        </Button>
        <Button size={"icon"} variant={"ghost"}>
          <PlusIcon />
        </Button>
      </div>
    </section>
  );
}
