import Type from "../Type/Type";
import { cn } from "@/lib/utils";

export interface StepperStep {
  number: number;
  title: string;
  optional?: boolean;
  active?: boolean;
}

export interface StepperProps {
  steps: StepperStep[];
  className?: string;
}

export default function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={cn("text-sm py-6 px-4 flex flex-col max-w-[500px]", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isActive = step.active;

        return (
          <div key={step.number} className="flex relative">
            <div className="flex flex-col items-center mr-4">
              <div
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2",
                  isActive
                    ? "bg-background !border-primary border-dashed"
                    : "bg-background border-2 border-dashed !border-muted-foreground/50"
                )}
              >
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[2rem] -mt-2 bg-muted-foreground/30"
                  )}
                />
              )}
            </div>

            <div
              className={cn(
                "flex flex-col pb-8 cursor-pointer",
                !isActive && "text-muted-foreground"
              )}
            >
              <Type className="text-xs">
                Step {step.number}
                {step.optional && (
                  <>
                    {" "}
                    - <span className="italic">optional</span>
                  </>
                )}
              </Type>
              <div
                className={cn(
                  "flex items-center gap-2",
                  isActive ? "font-medium text-primary" : "font-medium"
                )}
              >
                <Type>{step.title}</Type>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
