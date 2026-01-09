"use client";

import { defaultNavItems, NavItemsI, NavItemOrDivider } from "@/store/sidebar/sidebar.constants";
import useSidebarStore from "@/store/sidebar/sidebar.store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SidebarNavigation({
  children,
  navItems,
  hidden,
  className
}: {
  children?: React.ReactNode;
  navItems?: NavItemOrDivider[] | NavItemsI;
  hidden?: boolean;
  className?: string;
}) {
  const { setNavItems, setChildren, setHidden, setClassName } = useSidebarStore();
  const pathname = usePathname();

  // Reset values
  useEffect(() => {
    return () => {
      setNavItems(defaultNavItems);
      setChildren(null);
      setHidden(false);
      setClassName(null);
    };
  }, [pathname]);

  useEffect(() => {
    setChildren(children);
  }, [children, setChildren]);

  useEffect(() => {
    setNavItems(navItems || null);
  }, [navItems, setNavItems]);

  useEffect(() => {
    if (hidden != undefined) {
      setHidden(hidden);
    }
  }, [hidden, setHidden]);

  useEffect(() => {
    if (className) {
      setClassName(className);
    }
  }, [className, setClassName]);

  return null;
}
