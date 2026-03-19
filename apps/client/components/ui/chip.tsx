import { cn } from "@/lib/utils";

type ChipStatus = "active" | "warning" | "neutral" | "danger" | "primary" | "skeleton";

interface ChipProps {
  status: ChipStatus;
  children?: React.ReactNode;
  className?: string
}

export default function Chip({ status, children, className }: ChipProps) {
  return (
    <span
      className={cn(
        "px-1.5 py-[2px] rounded-full text-[10px] tracking-wide border",
        status === "active" && "bg-success/20 text-success",
        status === "warning" && "bg-warning/20 text-warning",
        status === "neutral" && "bg-default/20 text-default-600",
        status === "danger" && "bg-destructive/20 text-destructive",
        status === "primary" && "bg-primary/20 text-primary",
        status === "skeleton" && "bg-muted animate-pulse text-transparent",
        className
      )}
    >
      {children || status}
    </span>
  );
}
