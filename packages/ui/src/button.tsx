import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:shadow-premium-active",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-premium-brand hover:bg-primary/90 [text-shadow:_0px_1px_2px_rgba(0,_0,_0,_0.15)]",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-premium hover:bg-destructive/90 [text-shadow:_0px_1px_2px_rgba(0,_0,_0,_0.15)]",
                "destructive-outline":
                    "border border-destructive text-destructive shadow-premium hover:bg-destructive hover:text-destructive-foreground",
                outline:
                    "border border-input bg-background shadow-premium hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-premium hover:bg-secondary/80 [text-shadow:_0px_1px_2px_rgba(0,_0,_0,_0.15)]",
                accent:
                    "bg-accent text-accent-foreground shadow-premium-purple hover:bg-accent/90 [text-shadow:_0px_1px_2px_rgba(0,_0,_0,_0.15)]",
                cyan:
                    "bg-brand-cyan text-brand-dark shadow-premium-cyan hover:bg-brand-cyan/90 [text-shadow:_0px_1px_2px_rgba(0,_0,_0,_0.15)]",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                xs: "h-6 rounded px-2 text-xs",
                sm: "h-7 rounded px-3 text-xs",
                default: "h-8 px-4 py-2",
                lg: "h-9 rounded px-8",
                xl: "h-10 rounded px-8",
                icon: "h-8 w-8",
                "icon-sm": "h-7 w-7",
                "icon-lg": "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? "span" : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };