"use client";

import { SparkleIcon } from "../../components/icons/sparkle";

export function Hero() {
  return (
    <div className="relative min-h-[500px] max-w-7xl mx-auto w-full border-l border-r border-gray-faint">
      <div className="h-full lg:px-24 py-10">A</div>
      <div className="bottom-0 absolute h-[0.25px] w-screen left-[calc(50%-50vw)] bg-gray-faint" />
      <SparkleIcon className="absolute -bottom-2.5 -left-3" />
      <SparkleIcon className="absolute -bottom-2.5 -right-3" />
    </div>
  );
}
