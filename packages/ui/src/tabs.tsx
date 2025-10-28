import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import { cn } from "./lib/utils";

const Tabs = BaseTabs.Root;

const TabsList = React.forwardRef<
    React.ElementRef<typeof BaseTabs.List>,
    React.ComponentPropsWithoutRef<typeof BaseTabs.List>
>(({ className, ...props }, ref) => (
    <BaseTabs.List
        ref={ref}
        className={cn(
            "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
));
TabsList.displayName = BaseTabs.List.displayName;

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof BaseTabs.Tab>,
    React.ComponentPropsWithoutRef<typeof BaseTabs.Tab>
>(({ className, ...props }, ref) => (
    <BaseTabs.Tab
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = BaseTabs.Tab.displayName;

const TabsContent = React.forwardRef<
    React.ElementRef<typeof BaseTabs.Panel>,
    React.ComponentPropsWithoutRef<typeof BaseTabs.Panel>
>(({ className, ...props }, ref) => (
    <BaseTabs.Panel
        ref={ref}
        className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
));
TabsContent.displayName = BaseTabs.Panel.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };