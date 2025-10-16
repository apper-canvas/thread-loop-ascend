import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import PostCard from "@/components/organisms/PostCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { postsService } from "@/services/api/postsService";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  const query = searchParams.get("q") || "";

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    try {
      setError("");
      setLoading(true);
      setHasSearched(true);
      const data = await postsService.search(searchQuery);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    setSearchParams({ q: searchQuery });
    performSearch(searchQuery);
  };

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-secondary to-blue-600 rounded-xl p-6 text-white shadow-lg mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <ApperIcon name="Search" className="w-6 h-6 mr-2" />
            Search Posts
          </h1>
          <p className="text-white/90">
            Find posts across all communities on Thread Loop
          </p>
        </div>

        <SearchBar
          placeholder="Search for posts, topics, discussions..."
          onSearch={handleSearch}
          className="max-w-2xl mx-auto"
        />
      </motion.div>

      {/* Search Results */}
      {loading ? (
        <Loading variant="feed" />
      ) : error ? (
        <Error message={error} onRetry={() => performSearch(query)} />
      ) : !hasSearched ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Search" className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Search Thread Loop
          </h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Enter a search term above to find posts, discussions, and content across all communities.
          </p>
        </motion.div>
      ) : posts.length === 0 ? (
        <Empty
          title="No results found"
          message={`No posts found for "${query}". Try different keywords or browse communities instead.`}
          actionLabel="Browse Popular Posts"
          onAction={() => window.location.href = "/?sort=top"}
          icon="Search"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Results Header */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <ApperIcon name="FileText" className="w-5 h-5 mr-2 text-secondary" />
                Search Results
              </h2>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {posts.length} post{posts.length !== 1 ? "s" : ""} found for "{query}"
              </span>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard 
                  post={post} 
                  onVote={() => performSearch(query)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Search;