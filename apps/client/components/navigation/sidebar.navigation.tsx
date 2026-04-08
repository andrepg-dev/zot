"use client";

import { defaultNavItems, NavItemOrDivider, NavItemsI } from "@/store/sidebar/sidebar.constants";
import useSidebarStore from "@/store/sidebar/sidebar.store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SidebarNavigation({
  children,
  navItems,
  hidden,
  className,
  resizable,
  maxWidth,
  minWidth,
  storageKey
}: {
  children?: React.ReactNode;
  navItems?: NavItemOrDivider[] | NavItemsI;
  hidden?: boolean;
  className?: string;
  resizable?: boolean;
  maxWidth?: number;
  minWidth?: number;
  storageKey?: string;
}) {
  const {
    setNavItems,
    setChildren,
    setHidden,
    setClassName,
    setResizable,
    setMaxWidth,
    setMinWidth,
    setStorageKey
  } = useSidebarStore();
  const pathname = usePathname();

  // Reset values
  useEffect(() => {
    return () => {
      setNavItems(defaultNavItems);
      setChildren(null);
      setHidden(false);
      setClassName(null);
      setResizable(true);
      setMaxWidth(null);
      setMinWidth(null);
      setStorageKey(null);
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

  useEffect(() => {
    if (resizable != undefined) {
      setResizable(resizable);
    }
  }, [resizable, setResizable]);

  useEffect(() => {
    setMaxWidth(maxWidth ?? null);
  }, [maxWidth, setMaxWidth]);

  useEffect(() => {
    setMinWidth(minWidth ?? null);
  }, [minWidth, setMinWidth]);

  useEffect(() => {
    setStorageKey(storageKey ?? null);
  }, [storageKey, setStorageKey]);

  return null;
}
