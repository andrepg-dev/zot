import { cn } from "@/lib/utils";
import Type from "../type";

export default function Title({
  children,
  description,
  className,
  classNames,
  rightChildren
}: {
  children: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  classNames?: {
    title?: string;
    description?: string;
  };
  rightChildren?: React.ReactNode
}) {
  return (
    <div className="flex justify-between items-center">
      <div className={cn("flex flex-col", className)}>
        <Type variant="h4" className={cn("font-medium", classNames?.title)}>
          {children}
        </Type>
        <h6 className={cn("text-muted-foreground mt-1", classNames?.description)}>
          {description}
        </h6>
      </div>

      {rightChildren}
    </div>
  );
}
