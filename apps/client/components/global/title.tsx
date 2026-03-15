import { cn } from "@/lib/utils";
import Type from "../type";

export default function Title({
  children,
  description,
  className,
  classNames
}: {
  children: React.ReactNode;
  description?: string;
  className?: string;
  classNames?: {
    title?: string;
    description?: string;
  };
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <Type variant="h4" className={cn("font-medium", classNames?.title)}>
        {children}
      </Type>
      <h6 className={cn("text-muted-foreground", classNames?.description)}>
        {description}
      </h6>
    </div>
  );
}
