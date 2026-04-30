"use client";

import { cn } from "@/lib/utils";
import { Input, InputProps } from "@heroui/input";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const InputComponent = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { value: valueProp, maxLength, onChange, type, startContent, ...rest } = props;
  const [inputValue, setInputValue] = useState(valueProp ?? "");
  const innerRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    const el = innerRef.current!;
    const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!;

    Object.defineProperty(el, "value", {
      get: () => descriptor.get!.call(el),
      set: (v: string) => {
        descriptor.set!.call(el, v);
        setInputValue(v);
      },
      configurable: true
    });

    return el;
  });

  useEffect(() => {
    if (valueProp !== undefined) {
      setInputValue(valueProp);
    }
  }, [valueProp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    if (type === "url") {
      val = val.replace(/^https?:\/\//, "");

      const nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      nativeSet.call(e.target, val);
    }

    setInputValue(val);
    onChange?.(e);
  };

  const defaultStartContent =
    type === "url" && !startContent ? (
      <span className="text-xs bg-default-100 text-muted-foreground rounded-sm p-1 px-2">
        https://
      </span>
    ) : undefined;

  return (
    <div className="relative">
      <Input
        ref={innerRef}
        type={type}
        value={inputValue}
        onChange={handleChange}
        maxLength={maxLength}
        className={cn("flex-1 hover:!bg-transparent !text-[13px]")}
        classNames={{
          inputWrapper:
            "!text-[13px] data-[focus=true]:ring-offset-2 data-[focus=true]:ring-offset-black data-[focus=true]:ring-2 data-[focus=true]:ring-primary/70 data-[focus=true]:bg-default-100/50 data-[hover=true]:!bg-default-100/50 bg-default-100/50 border",
          input: "!text-[13px]"
        }}
        startContent={startContent || defaultStartContent}
        endContent={
          maxLength && (
            <span className="text-xs text-muted-foreground text-center p-1 rounded-sm bg-default-100 min-w-max">
              {String(inputValue).length}/{maxLength}
            </span>
          )
        }
        {...rest}
      />
    </div>
  );
});

InputComponent.displayName = "InputComponent";
export default InputComponent;
