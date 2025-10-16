import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import CommunityCard from "@/components/molecules/CommunityCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { communitiesService } from "@/services/api/communitiesService";

const Sidebar = () => {
  const location = useLocation();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCommunities = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await communitiesService.getPopular();
      setCommunities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  const navigationItems = [
    { path: "/", label: "Home Feed", icon: "Home", exact: true },
    { path: "/?sort=hot", label: "Hot Posts", icon: "TrendingUp" },
    { path: "/?sort=new", label: "New Posts", icon: "Clock" },
    { path: "/?sort=top", label: "Top Posts", icon: "Award" }
  ];

  const isActivePath = (path, exact = false) => {
    if (exact) {
      return location.pathname === "/" && !location.search;
    }
    return location.search.includes(path.split("?")[1]) || 
           (location.pathname === "/" && path === "/?sort=hot" && !location.search);
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto h-full">
      <div className="p-6 space-y-8">
        {/* Main Navigation */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Compass" className="w-5 h-5 mr-2 text-primary" />
            Navigation
          </h2>
          <nav className="space-y-2">
            {navigationItems.map((item, index) => {
              const isActive = isActivePath(item.path, item.exact);
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-orange-100 text-primary border-l-4 border-primary"
                      : "text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
                  }`}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Popular Communities */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Users" className="w-5 h-5 mr-2 text-secondary" />
            Popular Communities
          </h2>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-3 p-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <Error message={error} onRetry={loadCommunities} />
          ) : (
            <div className="space-y-3">
              {communities.slice(0, 8).map((community) => (
                <motion.div
                  key={community.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CommunityCard 
                    community={community} 
                    showDescription={false}
                    className="hover:shadow-md"
                  />
                </motion.div>
              ))}
              
              {communities.length > 8 && (
                <Link 
                  to="/communities" 
                  className="block w-full p-3 text-center text-sm text-secondary hover:text-secondary/80 font-medium border-2 border-dashed border-gray-200 hover:border-secondary/50 rounded-xl transition-all"
                >
                  View all communities
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Community Stats */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <ApperIcon name="BarChart3" className="w-4 h-4 mr-2 text-accent" />
            Community Stats
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Communities</span>
              <span className="font-bold text-gray-900">{communities.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Members</span>
              <span className="font-bold text-gray-900">
                {communities.reduce((sum, c) => sum + c.memberCount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;