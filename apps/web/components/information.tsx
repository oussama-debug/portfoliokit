"use client";

import { SparkleIcon } from "./icons/sparkle";

export function Information() {
  return (
    <div className="container relative mx-auto">
      <div className="p-6 border-l border-r border-gray-faint relative mx-auto max-w-7xl">
        <SparkleIcon className="pointer-events-none -right-[11.5px] absolute -bottom-[11px] contain-[layout,paint] " />
        <SparkleIcon className="pointer-events-none -left-[11.5px] absolute -bottom-[11px] contain-[layout,paint] " />
      </div>
      <div className="bottom-0 absolute h-[0.25px] w-screen left-[calc(50%-50vw)] bg-gray-faint" />
    </div>
  );
}
