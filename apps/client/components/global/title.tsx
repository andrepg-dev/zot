import { cn } from "@/lib/utils";
import Type from "../type";

export default function Title({
  children,
  description,
  className
}: {
  children: React.ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <Type variant="h4" className="font-medium">
        {children}
      </Type>
      <h6 className="text-muted-foreground">{description}</h6>
    </div>
  );
}
