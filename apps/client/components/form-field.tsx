import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { FieldError } from "react-hook-form";
import BillingDrawing from "./global/billing-drawing";
import Type from "./type";

interface FormFieldProps {
  title: string;
  description: ReactNode;
  children: ReactNode;
  isRequired?: boolean;
  isPremiumFeature?: boolean;
  error?: FieldError | undefined;
  className?: string;
  rightChildrenClassName?: string;
  icon?: ReactNode;
}

export default function FormField({
  title,
  description,
  children,
  isRequired = false,
  isPremiumFeature = false,
  error,
  className,
  rightChildrenClassName,
  icon
}: FormFieldProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-12", className)}>
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5">{icon}</div>}
        <div className="flex flex-col">
          <h6 className="text-sm font-medium flex items-center gap-1.5">
            {title} {isRequired && <span className="text-red-500">*</span>}
            {isPremiumFeature && (
              <BillingDrawing>
                <Type variant="link" className="ml-1 text-xs text-orange-500">
                  Premium
                </Type>
              </BillingDrawing>
            )}
          </h6>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className={cn("flex flex-col", rightChildrenClassName)}>
        {children}
        {error && <p className="text-xs text-danger mt-1">{error.message}</p>}
      </div>
    </div>
  );
}
