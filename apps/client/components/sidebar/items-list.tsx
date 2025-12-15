"use client";

import { cn } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ItemList({ navItems }: { navItems: any }) {
  const pathname = usePathname();

  return (
    <ul className="text-sm space-y-1 pt-4 px-2">
      {navItems?.map((item: any) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={clsx(
                "flex items-center gap-2 py-1.5 px-2 h-[35px] text-muted-foreground rounded-sm  hover:bg-default/60",
                {
                  "text-white bg-default/60": isActive,
                }
              )}
            >
              {item.icon ? (
                <Icon
                  className={cn("size-4", isActive && "text-primary-400")}
                />
              ) : null}{" "}
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
