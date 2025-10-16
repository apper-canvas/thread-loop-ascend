import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  children,
  error,
  label,
  ...props 
}, ref) => {
  const selectStyles = cn(
    "w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 transition-all duration-200",
    "focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none appearance-none",
    "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
    error && "border-error focus:border-error focus:ring-error/20",
    className
  );

  const selectElement = (
    <div className="relative">
      <select
        className={selectStyles}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
      />
    </div>
  );

  if (label) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {selectElement}
        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
      </div>
    );
  }

  return selectElement;
});

Select.displayName = "Select";

export default Select;