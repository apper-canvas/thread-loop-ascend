import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const VoteButtons = ({ 
  upvotes = 0, 
  downvotes = 0, 
  onVote, 
  itemId,
  orientation = "vertical",
  size = "md" 
}) => {
  const [userVote, setUserVote] = useState(null);
  const [optimisticUpvotes, setOptimisticUpvotes] = useState(upvotes);
  const [optimisticDownvotes, setOptimisticDownvotes] = useState(downvotes);

  const handleVote = async (voteType) => {
    if (!onVote) return;

    const previousVote = userVote;
    const newVote = previousVote === voteType ? null : voteType;
    
    // Optimistic update
    setUserVote(newVote);
    
    if (previousVote === "up") {
      setOptimisticUpvotes(prev => prev - 1);
    } else if (previousVote === "down") {
      setOptimisticDownvotes(prev => prev - 1);
    }
    
    if (newVote === "up") {
      setOptimisticUpvotes(prev => prev + 1);
    } else if (newVote === "down") {
      setOptimisticDownvotes(prev => prev + 1);
    }

    try {
      await onVote(itemId, newVote);
      toast.success(`${newVote ? (newVote === "up" ? "Upvoted" : "Downvoted") : "Vote removed"}!`);
    } catch (error) {
      // Revert optimistic update
      setUserVote(previousVote);
      setOptimisticUpvotes(upvotes);
      setOptimisticDownvotes(downvotes);
      toast.error("Failed to register vote");
    }
  };

  const netScore = optimisticUpvotes - optimisticDownvotes;
  
  const sizeClasses = {
    sm: {
      button: "w-8 h-8",
      icon: "w-4 h-4",
      text: "text-xs"
    },
    md: {
      button: "w-10 h-10",
      icon: "w-5 h-5", 
      text: "text-sm"
    },
    lg: {
      button: "w-12 h-12",
      icon: "w-6 h-6",
      text: "text-base"
    }
  };

  const containerClasses = cn(
    "flex items-center gap-1",
    orientation === "horizontal" ? "flex-row" : "flex-col"
  );

  return (
    <div className={containerClasses}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleVote("up")}
        className={cn(
          "rounded-full border-2 transition-all duration-150 flex items-center justify-center",
          sizeClasses[size].button,
          userVote === "up" 
            ? "bg-primary border-primary text-white shadow-lg" 
            : "border-gray-300 hover:border-primary hover:bg-primary/10 text-gray-600"
        )}
      >
        <ApperIcon 
          name="ArrowUp" 
          className={cn(
            sizeClasses[size].icon,
            userVote === "up" ? "text-white" : "text-gray-600"
          )} 
        />
      </motion.button>

      <motion.span 
        key={netScore}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        className={cn(
          "font-bold text-gray-900 min-w-[2ch] text-center",
          sizeClasses[size].text,
          netScore > 0 && "text-primary",
          netScore < 0 && "text-secondary"
        )}
      >
        {netScore > 0 ? `+${netScore}` : netScore}
      </motion.span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleVote("down")}
        className={cn(
          "rounded-full border-2 transition-all duration-150 flex items-center justify-center",
          sizeClasses[size].button,
          userVote === "down" 
            ? "bg-secondary border-secondary text-white shadow-lg" 
            : "border-gray-300 hover:border-secondary hover:bg-secondary/10 text-gray-600"
        )}
      >
        <ApperIcon 
          name="ArrowDown" 
          className={cn(
            sizeClasses[size].icon,
            userVote === "down" ? "text-white" : "text-gray-600"
          )} 
        />
      </motion.button>
    </div>
  );
};

export default VoteButtons;