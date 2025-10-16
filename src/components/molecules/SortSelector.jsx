import React from "react";
import { cn } from "@/utils/cn";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const SortSelector = ({ 
  value = "hot", 
  onChange, 
  className,
  options = [
    { value: "hot", label: "Hot", icon: "TrendingUp" },
    { value: "new", label: "New", icon: "Clock" },
    { value: "top", label: "Top", icon: "Award" }
  ]
}) => {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
        <ApperIcon name="ArrowUpDown" className="w-4 h-4" />
        <span className="font-medium">Sort by</span>
      </div>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gradient-to-r from-white to-gray-50 border-gray-200 focus:border-secondary shadow-sm hover:shadow-md transition-all duration-200"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {selectedOption && (
        <div className="flex items-center mt-2 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <ApperIcon name={selectedOption.icon} className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-700 font-medium">
            Showing {selectedOption.label.toLowerCase()} posts
          </span>
        </div>
      )}
    </div>
  );
};

export default SortSelector;