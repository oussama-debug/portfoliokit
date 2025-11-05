"use client";

import { Popover as PopoverPrimitive } from "@base-ui-components/react/popover";

import { cn } from "@repo/ui/lib/utils";

const Popover = PopoverPrimitive.Root;

function PopoverTrigger(props: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverPopup({
  children,
  className,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  tooltipStyle = false,
  ...props
}: PopoverPrimitive.Popup.Props & {
  side?: PopoverPrimitive.Positioner.Props["side"];
  align?: PopoverPrimitive.Positioner.Props["align"];
  sideOffset?: PopoverPrimitive.Positioner.Props["sideOffset"];
  tooltipStyle?: boolean;
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        data-slot="popover-positioner"
        className="z-50"
        side={side}
        sideOffset={sideOffset}
        align={align}
      >
        <span
          className={cn(
            "relative flex origin-(--transform-origin) rounded-lg border bg-popover bg-clip-padding shadow-lg transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] has-data-starting-style:scale-98 has-data-starting-style:opacity-0 dark:bg-clip-border dark:before:shadow-[0_-1px_--theme(--color-white/8%)]",
            tooltipStyle && "rounded-md border-0 bg-foreground text-background shadow-sm"
          )}
        >
          <PopoverPrimitive.Popup
            data-slot="popover-content"
            className={cn(
              "max-h-(--available-height) overflow-y-auto",
              tooltipStyle ? "min-w-0 px-2 py-1 text-xs" : "min-w-80 p-4",
              className
            )}
            {...props}
          >
            {children}
          </PopoverPrimitive.Popup>
        </span>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverClose({ ...props }: PopoverPrimitive.Close.Props) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function PopoverDescription({ className, ...props }: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverTrigger,
  PopoverPopup,
  PopoverPopup as PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
};
