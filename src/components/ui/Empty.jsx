import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing here yet", 
  message = "Be the first to contribute!", 
  actionLabel = "Get Started",
  onAction,
  icon = "MessageCircle",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md text-lg">
        {message}
      </p>
      {onAction && actionLabel && (
        <Button 
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary transform hover:scale-105"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;