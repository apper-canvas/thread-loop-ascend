import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message, onRetry, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {message || "We encountered an error while loading this content. Please try again."}
      </p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;