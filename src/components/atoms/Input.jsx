import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error,
  label,
  ...props 
}, ref) => {
  const inputStyles = cn(
    "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200",
    "focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none",
    "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
    error && "border-error focus:border-error focus:ring-error/20",
    className
  );

  if (label) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type={type}
          className={inputStyles}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
      </div>
    );
  }

  return (
    <input
      type={type}
      className={inputStyles}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;