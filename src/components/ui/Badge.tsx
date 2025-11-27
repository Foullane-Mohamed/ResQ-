import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "secondary";
  size?: "sm" | "md" | "lg";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-gray-100 text-gray-800 border-gray-200",
      primary: "bg-blue-100 text-blue-800 border-blue-200",
      success: "bg-green-100 text-green-800 border-green-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      danger: "bg-red-100 text-red-800 border-red-200",
      secondary: "bg-slate-100 text-slate-800 border-slate-200",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-sm",
      lg: "px-3 py-1 text-sm",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full border",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
