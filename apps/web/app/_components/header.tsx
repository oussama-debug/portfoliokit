"use client";

import Link from "next/link";
import { Logo } from "../../components/icons/logo";
import { SparkleIcon } from "../../components/icons/sparkle";
import { Button } from "@repo/ui/components/button";

export function Header() {
  return (
    <div className="sticky border-l border-r border-gray-faint mx-auto container px-12 lg:px-24 py-4 lg:py-4 max-w-7xl flex justify-between transition-[padding] duration-[200ms] items-center">
      <div className="relative w-full">
        <div className="flex gap-24 justify-between items-center">
          <div className="relative">
            <Link href={"/"}>
              <Logo width={100} />
            </Link>
          </div>
          <div className="flex gap-2">
            <Button variant={"default"}>Get started for free</Button>
          </div>
        </div>
        <SparkleIcon className="absolute -bottom-[27px] -left-[107.5px]" />
        <SparkleIcon className="absolute -bottom-[27px] -right-[107.5px]" />
      </div>
      <div className="bottom-0 absolute h-[0.25px]  w-screen left-[calc(50%-50vw)] bg-gray-faint" />
    </div>
  );
}
