"use client";

import { cn } from "@/lib/utils";
import { NavItemOrDivider, NavItemsI } from "@/store/sidebar/sidebar.constants";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ItemList({ navItems }: { navItems: NavItemOrDivider[] | NavItemsI }) {
  const pathname = usePathname();

  // Convert NavItemsI to array if needed
  const itemsArray = Array.isArray(navItems) ? navItems : (navItems as any);

  return (
    <ul className="text-sm space-y-1 pt-4 px-2">
      {itemsArray?.map((item: any, index: number) => {
        if ("type" in item && item.type === "divider") {
          return (
            <li key={`divider-${index}`} className="my-2">
              <hr className="border-border" />
            </li>
          );
        }

        const navItem = item as { href: string; label: string; icon?: React.ComponentType<any> };

        const { icon: Icon, label: Label, href } = navItem;
        const isActive = pathname === href;

        return (
          <li key={href}>
            <Link
              href={href}
              className={clsx(
                "flex items-center gap-2 py-1.5 px-2 h-[35px] text-muted-foreground rounded-sm hover:bg-default-50",
                {
                  "text-white bg-default-100": isActive
                }
              )}
            >
              {Icon ? <Icon className={cn("size-4", isActive && "text-primary-400")} /> : null}
              {Label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
