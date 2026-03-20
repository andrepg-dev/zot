"use client";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline";
import { Drawer, DrawerContent, type DrawerProps } from "@heroui/react";
import React, { useState } from "react";

type Placement = NonNullable<DrawerProps["placement"]>;

interface GlobalDrawerProps extends Omit<DrawerProps, "size" | "radius" | "children"> {
  size?: DrawerProps["size"];
  expandedSize?: DrawerProps["size"];
  children: React.ReactNode;
}

const resizeHandleConfig: Record<
  Placement,
  {
    container: string;
    line: string;
    button: string;
    cursor: string;
    expandedIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    collapsedIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }
> = {
  right: {
    container: "left-0 top-0 h-full w-4 items-center justify-center",
    line: "inset-y-0 left-0 w-px",
    button: "ml-2",
    cursor: "cursor-col-resize",
    expandedIcon: ChevronRightIcon,
    collapsedIcon: ChevronLeftIcon
  },
  left: {
    container: "right-0 top-0 h-full w-4 items-center justify-center",
    line: "inset-y-0 right-0 w-px",
    button: "mr-2",
    cursor: "cursor-col-resize",
    expandedIcon: ChevronLeftIcon,
    collapsedIcon: ChevronRightIcon
  },
  top: {
    container: "bottom-0 left-0 w-full h-4 items-center justify-center",
    line: "inset-x-0 bottom-0 h-px",
    button: "mb-2",
    cursor: "cursor-row-resize",
    expandedIcon: ChevronUpIcon,
    collapsedIcon: ChevronDownIcon
  },
  bottom: {
    container: "top-0 left-0 w-full h-4 items-center justify-center",
    line: "inset-x-0 top-0 h-px",
    button: "mt-2",
    cursor: "cursor-row-resize",
    expandedIcon: ChevronDownIcon,
    collapsedIcon: ChevronUpIcon
  }
};

function ResizeHandle({
  expanded,
  onToggle,
  placement = "right"
}: {
  expanded: boolean;
  onToggle: () => void;
  placement?: Placement;
}) {
  const config = resizeHandleConfig[placement];
  const ArrowIcon = expanded ? config.expandedIcon : config.collapsedIcon;

  return (
    <div
      className={`group absolute z-[9999] flex ${config.container} ${config.cursor}`}
      onClick={onToggle}
    >
      <div
        className={`absolute ${config.line} bg-border opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
      />
      <div
        className={`flex size-6 min-w-4 min-h-6 ${config.button} items-center justify-center rounded border bg-default-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
      >
        <ArrowIcon className="size-3" />
      </div>
    </div>
  );
}

export default function GlobalDrawer({
  size = "2xl",
  expandedSize,
  isOpen,
  onOpenChange,
  children,
  classNames,
  ...props
}: GlobalDrawerProps) {
  const [expanded, setExpanded] = useState(false);

  function handleOpenChange(open: boolean) {
    if (!open) setExpanded(false);
    onOpenChange?.(open);
  }

  const currentSize = expanded && expandedSize ? expandedSize : size;

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      size={currentSize}
      radius="sm"
      classNames={{
        ...classNames,
        base: `transition-all duration-300 ${classNames?.base ?? ""}`
      }}
      {...props}
    >
      <DrawerContent>
        <>
          {expandedSize && (
            <ResizeHandle
              expanded={expanded}
              onToggle={() => setExpanded((prev) => !prev)}
              placement={props.placement}
            />
          )}
          {children}
        </>
      </DrawerContent>
    </Drawer>
  );
}
