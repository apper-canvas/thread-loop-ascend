import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const CommunityCard = ({ community, className, showDescription = true }) => {
  const navigate = useNavigate();

  const formatMemberCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <motion.div
      whileHover={{ y: -2, shadow: "0 8px 25px rgba(0,0,0,0.15)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/r/${community.Id}`)}
      className={cn(
        "bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-sm border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start space-x-3">
        {community.iconUrl ? (
          <img
            src={community.iconUrl}
            alt={community.name}
            className="w-12 h-12 rounded-full object-cover bg-gradient-to-br from-primary/20 to-secondary/20"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <ApperIcon name="Users" className="w-6 h-6 text-primary" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 truncate hover:text-primary transition-colors">
            {community.name}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <ApperIcon name="Users" className="w-4 h-4 mr-1" />
            <span className="font-medium">
              {formatMemberCount(community.memberCount)} members
            </span>
          </div>

          {showDescription && community.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {community.description}
            </p>
          )}
        </div>

        <div className="flex items-center text-gray-400">
          <ApperIcon name="ChevronRight" className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityCard;