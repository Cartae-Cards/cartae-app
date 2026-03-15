// src/components/ui/Button.tsx

import { ButtonHTMLAttributes } from "react";

// These are the three visual styles your button can have
type ButtonVariant = "primary" | "secondary" | "ghost";

// These are the two sizes your button can be
type ButtonSize = "sm" | "md" | "lg";

// This defines what props (settings) the Button accepts
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

// This maps each variant to its Tailwind CSS classes
const variantClasses: Record<ButtonVariant, string> = {
  // Primary: solid navy background, white text
  primary:
    "bg-navy-700 text-white hover:bg-navy-800 border border-transparent",
  // Secondary: transparent background, navy border and text
  secondary:
    "bg-transparent text-navy-700 border border-navy-700 hover:bg-navy-50",
  // Ghost: no background or border, just text with a hover effect
  ghost:
    "bg-transparent text-navy-700 border border-transparent hover:bg-navy-50",
};

// This maps each size to its Tailwind CSS classes
const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      // Combine all the classes together
      className={`
        inline-flex items-center justify-center
        rounded-lg font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      // Disable the button if it's loading or already disabled
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Show a spinner inside the button when loading */}
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
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
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}