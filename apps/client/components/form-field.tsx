import { ReactNode } from "react";
import { FieldError } from "react-hook-form";
import Type from "./type";

interface FormFieldProps {
  title: string;
  description: ReactNode;
  children: ReactNode;
  isRequired?: boolean;
  isPremiumFeature?: boolean;
  error?: FieldError | undefined;
}

export default function FormField({
  title,
  description,
  children,
  isRequired = false,
  isPremiumFeature = false,
  error
}: FormFieldProps) {
  return (
    <div className="grid grid-cols-2 gap-12">
      <div className="flex flex-col">
        <h6 className="text-sm font-medium">
          {title} {isRequired && <span className="text-red-500">*</span>}
          {isPremiumFeature && (
            <Type variant="link" className="ml-1 text-xs text-orange-500">
              Premium
            </Type>
          )}
        </h6>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-col">
        {children}
        {error && <p className="text-xs text-danger mt-1">{error.message}</p>}
      </div>
    </div>
  );
}
