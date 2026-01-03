"use client";

import { cn } from "@/lib/utils";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import Sidebar from "../sidebar/sidebar";

export default function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { editionType } = useLandingPageState();

  return (
    <div className="flex flex-row flex-1 bg-[#060606] overflow-hidden">
      <Sidebar />
      {/* Content */}
      <main
        className={cn(
          "w-full overflow-y-auto bg-black rounded-t-xl border border-b-0",
          editionType === "manually" ? "m-2 mb-0" : "mx-2 ml-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}
