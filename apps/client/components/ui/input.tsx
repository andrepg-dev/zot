import { cn } from "@/lib/utils";
import { Input, InputProps } from "@heroui/input";
import { forwardRef, useEffect, useState } from "react";

const InputComponent = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { value, maxLength, onChange, type, ...rest } = props;
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.(e);
  };

  return (
    <div className="relative">
      <Input
        ref={ref}
        value={inputValue}
        onChange={handleChange}
        maxLength={maxLength}
        className={cn(
          "flex-1 rounded-lg outline-primary data-[focus=true]:outline-2 hover:!bg-transparent"
        )}
        classNames={{
          inputWrapper:
            "data-[focus=true]:bg-default-100/50 data-[hover=true]:!bg-default-100/50 bg-default-100/50 border",
          input: "text-xs"
        }}
        startContent={
          type === "url" && (
            <span className="text-xs bg-default-100 text-muted-foreground rounded-sm p-1 px-2">
              https://
            </span>
          )
        }
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
