import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Tabulation() {
  return (
    <div className="px-6 pr-4 py-2.5 border-r bg-[#0F0F10] max-w-min flex items-center gap-3 cursor-pointer select-none">
      <div className="flex gap-1 items-center">
        <span className="italic text-xs">page.tsx</span>
      </div>
      <button className="p-0.5 cursor-pointer hover:bg-[#abb2bf]/20 rounded-sm">
        <XMarkIcon className="size-3.5" />
      </button>
    </div>
  );
}
