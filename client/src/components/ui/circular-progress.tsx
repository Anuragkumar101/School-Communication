import * as React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  size?: number;
  className?: string;
  color?: string;
}

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(({ size = 24, className, color, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("animate-spin", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color || "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
});

CircularProgress.displayName = "CircularProgress";

export { CircularProgress };