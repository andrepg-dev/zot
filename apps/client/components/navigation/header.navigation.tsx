"use client";

import useHeaderStore from "@/store/header/header.store";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function HeaderNavigation({
  children,
}: {
  children?: ReactNode;
}) {
  const { setChildren } = useHeaderStore();
  const pathname = usePathname();

  useEffect(() => {
    setChildren(children ?? null);

    return () => {
      setChildren(null);
    };
  }, [children, setChildren, pathname]);

  return null;
}
