import { cn } from "@/lib/utils";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Tabulation({ title, isActive }: { title: string; isActive?: boolean }) {
  return (
    <div
      className={cn(
        "px-6 pr-4 py-2.5 border-r  min-w-min flex items-center gap-3 cursor-pointer select-none",
        !isActive ? "bg-default-100" : "bg-[#0F0F10]"
      )}
    >
      <div className="flex gap-1 items-center">
        <span className="italic text-xs">{title}</span>
      </div>
      <button className="p-0.5 cursor-pointer hover:bg-[#abb2bf]/20 rounded-sm">
        <XMarkIcon className="size-3.5" />
      </button>
    </div>
  );
}
