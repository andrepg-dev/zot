import { HeroUIProvider } from "@heroui/system";
import React from "react";

export default function StoryProvider({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
