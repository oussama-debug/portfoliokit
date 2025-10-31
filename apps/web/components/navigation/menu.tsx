"use client";

import { NavigationLink } from "./link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar04Icon,
  Home04Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";

const links = [
  {
    title: "Workspace",
    id: "workspace",
    links: [
      { title: "Dashboard", href: "/dashboard", icon: Home04Icon },
      { title: "Bookings", href: "/scheduled", icon: Calendar04Icon },
      { title: "Settings", href: "/settings", icon: Settings02Icon },
    ],
  },
];
export function NavigationMenu() {
  return (
    <ul className="w-full flex flex-col py-3 lg:px-3 space-y-0">
      {links.map((section) => (
        <li key={section.id}>
          <ul className="w-full flex flex-col space-y-0">
            <li className="ml-3 uppercase text-xs mb-2 text-zinc-600 font-medium tracking-widest">
              {section.title}
            </li>
            {section.links.map((link) => (
              <li
                key={link.href}
                className="w-full flex justify-start items-center"
              >
                <NavigationLink
                  href={link.href}
                  className="w-full justify-start flex flex-row items-center"
                >
                  <HugeiconsIcon
                    strokeWidth={2}
                    icon={link.icon}
                    className="h-4 w-4"
                  />
                  <span>{link.title}</span>
                </NavigationLink>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
