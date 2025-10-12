"use client";

import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const notificationVariants = cva(
  "relative text-white px-2 sm:px-2 lg:px-6 py-3 overflow-hidden",
  {
    variants: {
      variant: {
        destructive: "bg-destructive",
        warning: "bg-amber-500",
        success: "bg-emerald-600",
        info: "bg-blue-600",
      },
      padding: {
        none: "p-0",
        small: "p-1",
        medium: "p-2",
        large: "p-3",
      },
    },
    defaultVariants: {
      variant: "destructive",
      padding: "medium",
    },
  }
);

const stripeVariants = cva("absolute inset-0", {
  variants: {
    variant: {
      destructive: "opacity-10",
      warning: "opacity-10",
      success: "opacity-10",
      info: "opacity-10",
    },
    pattern: {
      stripes:
        "bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.3)_10px,rgba(0,0,0,0.3)_20px)]",
      dots: "bg-[radial-gradient(circle,rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[length:10px_10px]",
      none: "",
    },
  },
  defaultVariants: {
    variant: "destructive",
    pattern: "stripes",
  },
});

interface NotificationProps extends VariantProps<typeof notificationVariants> {
  children: React.ReactNode;
  message?: string;
  pattern?: "stripes" | "dots" | "none";
  showIcon?: boolean;
}

const iconMap = {
  destructive: AlertTriangle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

export function Notification({
  children,
  message,
  variant = "destructive",
  padding = "medium",
  pattern = "stripes",
  showIcon = true,
}: NotificationProps) {
  const Icon = iconMap[variant || "destructive"];

  return (
    <div className="min-h-screen flex flex-col">
      <div className={cn(notificationVariants({ variant, padding }))}>
        <div className={cn(stripeVariants({ variant, pattern }))} />
        <div className="mx-auto flex items-center gap-3 relative z-10">
          {showIcon && (
            <Icon strokeWidth={2.5} className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm sm:text-md font-medium">{message}</span>
        </div>
      </div>
      <div className="bg-zinc-50">{children}</div>
    </div>
  );
}
