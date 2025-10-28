import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox";
import { cn } from "./lib/utils";

const Checkbox = React.forwardRef<
    React.ElementRef<typeof BaseCheckbox.Root>,
    React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>
>(({ className, ...props }, ref) => (
    <BaseCheckbox.Root
        ref={ref}
        className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            className
        )}
        {...props}
    >
        <BaseCheckbox.Indicator className={cn("flex items-center justify-center text-current")}>
            <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
            >
                <path
                    d="m11.4669 3.72684c.1944-.17135.4956-.15872.6739.02827.1783.18699.1651.48787-.0293.66069L7.39775 8.33379c-.18617.16388-.46928.16388-.65545 0L3.92436 5.72684c-.1944-.17282-.2076-.47370-.0293-.66069.1783-.18699.4795-.19962.6739-.02827L7.07 7.17684l4.3969-3.45Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                />
            </svg>
        </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
));
Checkbox.displayName = BaseCheckbox.Root.displayName;

export { Checkbox };