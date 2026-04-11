import { cn } from "@/lib/utils";

type ChipStatus = "active" | "warning" | "neutral" | "danger" | "primary" | "skeleton" | "purple";

interface ChipProps {
  status: ChipStatus;
  children?: React.ReactNode;
  className?: string;
}

export default function Chip({ status, children, className }: ChipProps) {
  return (
    <span
      className={cn(
        "px-2 py-[2px] max-h-5.5 w-max flex items-center rounded-full text-[10px] tracking-wide border capitalize",
        status === "active" && "bg-success/20 text-success",
        status === "warning" && "bg-warning/20 text-warning",
        status === "neutral" && "bg-default-100/70 text-default-600",
        status === "danger" && "bg-danger/30 text-destructive",
        status === "primary" && "bg-primary/20 text-primary",
        status === "skeleton" && "bg-muted animate-pulse text-transparent",
        status === "purple" && "bg-[#4338CA]/30 text-[#cdcbe8]",
        className
      )}
    >
      {children || status}
    </span>
  );
}
