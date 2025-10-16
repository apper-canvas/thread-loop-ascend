import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* 404 Icon */}
          <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="AlertTriangle" className="w-16 h-16 text-primary" />
          </div>
          
          {/* 404 Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent mb-4"
          >
            404
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            Thread Not Found
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg mb-8 max-w-md mx-auto"
          >
            Looks like this thread has been deleted, moved, or never existed. 
            Let's get you back to the conversation!
          </motion.p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="min-w-[140px]"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Link to="/">
            <Button className="min-w-[140px]">
              <ApperIcon name="Home" className="w-4 h-4 mr-2" />
              Home Feed
            </Button>
          </Link>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Destinations
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/?sort=hot"
              className="text-secondary hover:text-secondary/80 font-medium transition-colors flex items-center space-x-1"
            >
              <ApperIcon name="TrendingUp" className="w-4 h-4" />
              <span>Hot Posts</span>
            </Link>
            <Link 
              to="/?sort=top"
              className="text-secondary hover:text-secondary/80 font-medium transition-colors flex items-center space-x-1"
            >
              <ApperIcon name="Award" className="w-4 h-4" />
              <span>Top Posts</span>
            </Link>
            <Link 
              to="/search"
              className="text-secondary hover:text-secondary/80 font-medium transition-colors flex items-center space-x-1"
            >
              <ApperIcon name="Search" className="w-4 h-4" />
              <span>Search</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;