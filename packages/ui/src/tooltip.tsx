import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import { cn } from "./lib/utils";

const TooltipProvider = BaseTooltip.Provider;

const Tooltip = BaseTooltip.Root;

const TooltipTrigger = BaseTooltip.Trigger;

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof BaseTooltip.Popup>,
    React.ComponentPropsWithoutRef<typeof BaseTooltip.Popup>
>(({ className, ...props }, ref) => (
    <BaseTooltip.Popup
        ref={ref}
        className={cn(
            "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
        )}
        {...props}
    />
));
TooltipContent.displayName = BaseTooltip.Popup.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };