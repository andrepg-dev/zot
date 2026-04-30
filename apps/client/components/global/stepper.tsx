import Type from "@/components/type";
import { cn } from "@/lib/utils";
import React from "react";

export interface StepperStep {
  number: number;
  title: string;
  optional?: boolean;
  disabled?: boolean;
}

export interface StepperProps {
  steps: StepperStep[];
  activeStep: number;
  onStepChange?: (step: number) => void;
  children?: React.ReactNode[];
  className?: string;
}

export default function Stepper({
  steps,
  activeStep,
  onStepChange,
  children,
  className
}: StepperProps) {
  return (
    <div className={cn("flex gap-8", className)}>
      <div className="text-sm py-6 px-4 flex flex-col max-w-[500px]">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isActive = step.number === activeStep;

          return (
            <div
              key={step.number}
              className={cn(
                "flex relative",
                step.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              )}
              onClick={() => {
                if (step.disabled) return;
                onStepChange?.(step.number);
              }}
            >
              <div className="flex flex-col items-center mr-4">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2",
                    isActive
                      ? "bg-background !border-primary border-dashed"
                      : "bg-background border-2 border-dashed !border-muted-foreground/50"
                  )}
                >
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-foreground" />}
                </div>
                {!isLast && (
                  <div className="w-0.5 flex-1 min-h-[2rem] -mt-2 bg-muted-foreground/30" />
                )}
              </div>

              <div className={cn("flex flex-col pb-8", !isActive && "text-muted-foreground")}>
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

      {children && <div className="flex-1">{children[activeStep - 1]}</div>}
    </div>
  );
}
