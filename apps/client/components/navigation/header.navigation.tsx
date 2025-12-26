"use client";

import useHeaderStore from "@/store/header/header.store";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function HeaderNavigation({
  children,
  navigationItems,
  postNavigationItems,
}: {
  children?: ReactNode;
  navigationItems?: Array<{ label: string; pathname: string }>;
  postNavigationItems?: ReactNode;
}) {
  const { setChildren, setNavigationItems, setPostNavigationItems } =
    useHeaderStore();
  const pathname = usePathname();

  useEffect(() => {
    setChildren(children);
    if (navigationItems) {
      setNavigationItems(navigationItems);
    }
    setPostNavigationItems(postNavigationItems);

    return () => {
      setChildren(null);
      setNavigationItems(null);
      setPostNavigationItems(null);
    };
  }, [children, setChildren, pathname]);

  return null;
}
