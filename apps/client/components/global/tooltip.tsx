import { cn } from "@/lib/utils";
import { Tooltip, TooltipProps } from "@heroui/tooltip";

interface GlobalTooltipProps extends TooltipProps {
  classNames?: TooltipProps["classNames"];
}

export default function GlobalTooltip({ classNames, ...props }: GlobalTooltipProps) {
  return (
    <Tooltip
      {...props}
      showArrow
      size="sm"
      classNames={{
        content: cn(classNames?.content),
        ...classNames
      }}
    />
  );
}
