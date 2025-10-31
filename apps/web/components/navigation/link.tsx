"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";

export function NavigationLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <Button
      variant={"ghost"}
      className={cn(className, pathname === href && "bg-accent")}
    >
      <Link href={href} className={cn("flex space-x-2 items-center")}>
        {children}
      </Link>
    </Button>
  );
}
