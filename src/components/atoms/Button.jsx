import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white shadow-md hover:shadow-lg focus:ring-primary transform hover:scale-105",
    secondary: "bg-gradient-to-r from-secondary to-blue-600 hover:from-blue-600 hover:to-secondary text-white shadow-md hover:shadow-lg focus:ring-secondary transform hover:scale-105",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary bg-white hover:shadow-md",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300",
    danger: "bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-error text-white shadow-md hover:shadow-lg focus:ring-error transform hover:scale-105"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "transform-none hover:scale-100",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;