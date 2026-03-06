"use client";

import { cn } from "@/lib/utils";
import { NavItemOrDivider, NavItemsI } from "@/store/sidebar/sidebar.constants";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ItemList({ navItems }: { navItems: NavItemOrDivider[] | NavItemsI }) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Convert NavItemsI to array if needed
  const itemsArray = Array.isArray(navItems) ? navItems : (navItems as any);

  // Get unique identifier for an item (href or label)
  const getItemId = (item: any): string => {
    return item.href || item.label;
  };

  // Auto-expand items if any of their subitems is active
  useEffect(() => {
    const itemsToExpand = new Set<string>();
    itemsArray?.forEach((item: any) => {
      if ("type" in item && item.type === "divider") return;
      if (item.subItem && item.subItem.length > 0) {
        const hasActiveSubItem = item.subItem.some((sub: any) => pathname === sub.href);
        if (hasActiveSubItem) {
          itemsToExpand.add(getItemId(item));
        }
      }
    });
    if (itemsToExpand.size > 0) {
      setExpandedItems(itemsToExpand);
    }
  }, [pathname, navItems]);

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isItemActive = (item: any): boolean => {
    if (item.href && pathname === item.href) return true;
    if (item.subItem) {
      return item.subItem.some((sub: any) => pathname === sub.href);
    }
    return false;
  };

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

        const navItem = item as {
          href?: string;
          label: string;
          icon?: React.ComponentType<any>;
          subItem?: Array<{ href: string; label: string; icon?: React.ComponentType<any> }>;
        };

        const { icon: Icon, label: Label, href, subItem } = navItem;
        const itemId = getItemId(navItem);
        const isExpanded = expandedItems.has(itemId);
        const isActive = isItemActive(navItem);
        const hasSubItems = subItem && subItem.length > 0;

        return (
          <li key={itemId}>
            <div>
              {hasSubItems ? (
                <div
                  className={clsx(
                    "flex items-center gap-2 py-1.5 px-2 h-[35px] text-muted-foreground rounded-sm cursor-pointer",
                    !isActive && "hover:bg-default-50",
                    isActive && "text-white"
                  )}
                  onClick={() => toggleExpand(itemId)}
                >
                  {Icon ? <Icon className={cn("size-4", isActive && "text-primary-400")} /> : null}
                  <span className="flex-1 text-left">{Label}</span>
                  <ChevronRightIcon
                    className={cn(
                      "size-4 transition-transform duration-200",
                      isExpanded && "rotate-90"
                    )}
                  />
                </div>
              ) : href ? (
                <Link
                  href={href}
                  className={clsx(
                    "flex items-center gap-2 py-1.5 px-2 h-[35px] text-muted-foreground rounded-sm",
                    !isActive && "hover:bg-default-50",
                    isActive && "text-white bg-default-100"
                  )}
                >
                  {Icon ? <Icon className={cn("size-4", isActive && "text-primary-400")} /> : null}
                  {Label}
                </Link>
              ) : null}
              {hasSubItems && isExpanded && (
                <ul className="pl-4 mt-1 space-y-1">
                  {subItem.map((sub: any) => {
                    const isSubActive = pathname === sub.href;
                    const SubIcon = sub.icon;
                    return (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className={cn(
                            "flex items-center gap-2 py-1.5 px-3 !rounded-l-none h-[35px] text-muted-foreground rounded-sm border-l-3",
                            isSubActive && "text-white",
                            !isSubActive && "hover:text-zinc-300 !border-l-transparent"
                          )}
                        >
                          {SubIcon ? (
                            <SubIcon className={cn("size-4", isSubActive && "text-primary-400")} />
                          ) : null}
                          {sub.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
