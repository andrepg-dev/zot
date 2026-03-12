import { cn } from "@/lib/utils";
import Type from "../Type/Type";

export interface TitleProps {
  children: React.ReactNode;
  description?: string;
  className?: string;
}

export default function Title({ children, description, className }: TitleProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <Type variant="h4" className="font-medium">
        {children}
      </Type>
      {description && <h6 className="text-muted-foreground">{description}</h6>}
    </div>
  );
}
