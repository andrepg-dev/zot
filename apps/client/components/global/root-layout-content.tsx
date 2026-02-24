"use client";

import { cn } from "@/lib/utils";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import { usePathname } from "next/navigation";
import Sidebar from "../sidebar/sidebar";

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { editionType } = useLandingPageState();
  const pathname = usePathname();

  return (
    <div className="flex flex-row flex-1 overflow-hidden bg-sidebar">
      <Sidebar />
      {/* Content */}
      <main
        className={cn(
          "relative z-[9999] w-full rounded-t-2xl bg-background border border-b-0 inset-shadow-background inset-shadow-sm",
          pathname.includes("/app/edit") && editionType === "manually"
            ? "overflow-hidden m-2 mb-0 mt-0"
            : "overflow-auto mx-2 ml-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}
