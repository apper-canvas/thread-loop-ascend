import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import { useAuth } from "@/layouts/Root";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import CreatePostModal from "@/components/organisms/CreatePostModal";

const Header = () => {
const navigate = useNavigate();
  const { logout } = useAuth();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };
  return (
    <>
<header className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center"
              >
                <ApperIcon name="MessageCircle" className="w-6 h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                  Thread Loop
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Community Discussions</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center space-x-1"
              >
                <ApperIcon name="Home" className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link 
                to="/?sort=top" 
                className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center space-x-1"
              >
                <ApperIcon name="TrendingUp" className="w-5 h-5" />
                <span>Popular</span>
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <SearchBar placeholder="Search Thread Loop..." />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search */}
              <button 
                onClick={() => navigate("/search")}
                className="md:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
              >
                <ApperIcon name="Search" className="w-5 h-5" />
              </button>

{/* Create Post Button - Authenticated Only */}
              {isAuthenticated && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="hidden sm:flex"
                >
                  <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
                  Create Post
                </Button>
              )}

              {/* Logout Button - Authenticated Only */}
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="hidden sm:flex"
                >
                  <ApperIcon name="LogOut" className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              )}

              {/* Login Button - Unauthenticated Only */}
              {!isAuthenticated && (
                <Button
                  onClick={() => navigate("/login")}
                  className="hidden sm:flex"
                >
                  <ApperIcon name="LogIn" className="w-5 h-5 mr-2" />
                  Login
                </Button>
              )}

              {/* Mobile Create Button */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="sm:hidden p-2 bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
              >
                <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
{isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden py-4 border-t border-gray-200"
            >
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-all"
                >
                  <ApperIcon name="Home" className="w-5 h-5" />
                  <span className="font-medium">Home Feed</span>
                </Link>
                <Link 
                  to="/?sort=top" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-all"
                >
                  <ApperIcon name="TrendingUp" className="w-5 h-5" />
                  <span className="font-medium">Popular Posts</span>
                </Link>
{/* Logout - Authenticated Only */}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-all"
                  >
                    <ApperIcon name="LogOut" className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                )}
                {/* Login - Unauthenticated Only */}
                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-all"
                  >
                    <ApperIcon name="LogIn" className="w-5 h-5" />
                    <span className="font-medium">Login</span>
                  </button>
                )}
                <div className="md:hidden px-4">
                  <SearchBar placeholder="Search Thread Loop..." />
                </div>
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  );
};

export default Header;