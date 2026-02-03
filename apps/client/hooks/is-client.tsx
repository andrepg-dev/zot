"use client"

import { useEffect, useState } from "react";

export default function useIsClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return { isClient: mounted }
}
