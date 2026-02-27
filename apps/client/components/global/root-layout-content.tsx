"use client";

import { cn } from "@/lib/utils";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import { usePathname } from "next/navigation";
import Sidebar from "../sidebar/sidebar";

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { editionType } = useLandingPageState();
  const pathname = usePathname();

  return (
    <div className="flex flex-row flex-1 overflow-hidden bg-sidebar shadow-[inset_-4px_0_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[inset_-4px_0_16px_-4px_rgba(0,0,0,0.35)]">
      <Sidebar />
      {/* Content */}
      <main
        className={cn(
          "relative z-[9999] w-full rounded-t-xl bg-background border border-b-0 inset-shadow-background inset-shadow-sm",
          "shadow-[0_0_10px_rgba(0,0,0,0.06)] dark:shadow-[0_0_16px_rgba(0,0,0,0.35)]",
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
