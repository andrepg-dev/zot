import { cn } from "@/lib/utils";

type ChipStatus = "active" | "warning" | "neutral" | "danger";

interface ChipProps {
  status: ChipStatus;
  label?: string;
}

export default function Chip({ status, label }: ChipProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        status === "active" && "bg-success/20 text-success",
        status === "warning" && "bg-warning/20 text-warning",
        status === "neutral" && "bg-default/20 text-default-600",
        status === "danger" && "bg-destructive/20 text-destructive",
      )}
    >
      {label || status}
    </span>
  );
}
