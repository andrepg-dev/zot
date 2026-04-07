"use client";

import useHeaderStore from "@/store/header/header.store";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function HeaderNavigation({
  children,
  navigationItems,
  postNavigationItems,
  hidden
}: {
  children?: ReactNode;
  navigationItems?: Array<{ label: React.ReactNode; pathname: string }>;
  postNavigationItems?: ReactNode;
  hidden?: boolean;
}) {
  const { setChildren, setNavigationItems, setPostNavigationItems, setHidden } = useHeaderStore();
  const pathname = usePathname();

  useEffect(() => {
    setChildren(children);
    if (navigationItems) {
      setNavigationItems(navigationItems);
    }
    setPostNavigationItems(postNavigationItems);
    setHidden(hidden ?? false);

    return () => {
      setChildren(null);
      setNavigationItems(null);
      setPostNavigationItems(null);
      setHidden(false);
    };
  }, [
    children,
    setChildren,
    pathname,
    navigationItems,
    postNavigationItems,
    hidden,
    setNavigationItems,
    setPostNavigationItems,
    setHidden
  ]);

  return null;
}
