import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import PostCard from "@/components/organisms/PostCard";
import SortSelector from "@/components/molecules/SortSelector";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CreatePostModal from "@/components/organisms/CreatePostModal";
import { postsService } from "@/services/api/postsService";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const sortType = searchParams.get("sort") || "hot";

  const loadPosts = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await postsService.getBySort(sortType);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [sortType]);

  const handleSortChange = (newSort) => {
    setSearchParams(newSort === "hot" ? {} : { sort: newSort });
  };

  const handlePostCreated = () => {
    loadPosts(); // Refresh posts after creating new one
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Loading variant="feed" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Error message={error} onRetry={loadPosts} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <h1 className="text-2xl font-bold mb-2">Welcome to Thread Loop</h1>
          <p className="text-white/90">
            Discover, share, and discuss content within topic-based communities
          </p>
        </motion.div>
      </div>

      {/* Sort Controls */}
      <div className="mb-6">
        <SortSelector 
          value={sortType} 
          onChange={handleSortChange}
        />
      </div>

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <Empty
          title="No posts found"
          message="Be the first to create a post and start the conversation!"
          actionLabel="Create First Post"
          onAction={() => setIsCreateModalOpen(true)}
          icon="MessageSquare"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard 
                post={post} 
                onVote={loadPosts}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Home;