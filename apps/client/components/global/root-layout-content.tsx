"use client";

import { cn } from "@/lib/utils";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import { usePathname } from "next/navigation";
import Sidebar from "../sidebar/sidebar";

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { editionType } = useLandingPageState();
  const pathname = usePathname();

  return (
    <div className="flex flex-row flex-1 dark:bg-[#060606] overflow-hidden">
      <Sidebar />
      {/* Content */}
      <main
        className={cn(
          "w-full dark:bg-black rounded-t-xl border border-b-0",
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
