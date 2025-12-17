"use client";

import { defaultNavItems, NavItemsI } from "@/store/sidebar/sidebar.constants";
import useSidebarStore from "@/store/sidebar/sidebar.store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SidebarNavigation({
  children,
  navItems,
  hidden,
}: {
  children?: React.ReactNode;
  navItems?: NavItemsI;
  hidden?: boolean;
}) {
  const { setNavItems, setChildren, setHidden } = useSidebarStore();
  const pathname = usePathname();

  // Reset values
  useEffect(() => {
    return () => {
      setNavItems(defaultNavItems);
      setChildren(null);
      setHidden(false);
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

  return null;
}
