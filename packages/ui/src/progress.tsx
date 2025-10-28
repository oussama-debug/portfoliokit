import * as React from "react";
import { Progress as BaseProgress } from "@base-ui-components/react/progress";
import { cn } from "./lib/utils";

const Progress = React.forwardRef<
    React.ElementRef<typeof BaseProgress.Root>,
    React.ComponentPropsWithoutRef<typeof BaseProgress.Root>
>(({ className, ...props }, ref) => (
    <BaseProgress.Root
        ref={ref}
        className={cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
            className
        )}
        {...props}
    >
        <BaseProgress.Indicator
            className="h-full w-full flex-1 bg-primary transition-all"
            style={{ transform: `translateX(-${100 - (props.value || 0)}%)` }}
        />
    </BaseProgress.Root>
));
Progress.displayName = BaseProgress.Root.displayName;

export { Progress };