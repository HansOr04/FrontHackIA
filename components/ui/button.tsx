import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-[#2e75b6] hover:bg-[#2563a8] text-white border-transparent",
  secondary:
    "bg-[#1a2332] hover:bg-[#243044] text-[#e2e8f0] border-[#2d3748]",
  ghost:
    "bg-transparent hover:bg-[#1a2332] text-[#94a3b8] border-transparent",
  danger:
    "bg-red-600 hover:bg-red-700 text-white border-transparent",
  outline:
    "bg-transparent hover:bg-[#1a2332] text-[#2e75b6] border-[#2e75b6]",
};

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg border",
        "transition-colors duration-150 cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClass[variant],
        sizeClass[size],
        className
      )}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
