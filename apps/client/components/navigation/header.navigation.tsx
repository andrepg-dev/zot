"use client";

import useHeaderStore from "@/store/header/header.store";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function HeaderNavigation({
  children,
  navigationItems,
}: {
  children?: ReactNode;
  navigationItems?: Array<{ label: string; pathname: string }>;
}) {
  const { setChildren, setNavigationItems } = useHeaderStore();
  const pathname = usePathname();

  useEffect(() => {
    setChildren(children ?? null);
    setNavigationItems(navigationItems ?? null);

    return () => {
      setChildren(null);
      setNavigationItems(null);
    };
  }, [children, setChildren, pathname]);

  return null;
}
