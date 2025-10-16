import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import PostCard from "@/components/organisms/PostCard";
import SortSelector from "@/components/molecules/SortSelector";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CreatePostModal from "@/components/organisms/CreatePostModal";
import { postsService } from "@/services/api/postsService";
import { communitiesService } from "@/services/api/communitiesService";

const Community = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortType, setSortType] = useState("hot");
  const [isJoined, setIsJoined] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadCommunity = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await communitiesService.getById(communityId);
      setCommunity(data);
      // Simulate user membership status
      setIsJoined(Math.random() > 0.5);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      setPostsLoading(true);
      const data = await postsService.getByCommunity(communityId);
      
      // Apply sorting
      let sortedPosts = [...data];
      switch (sortType) {
        case "hot":
          sortedPosts.sort((a, b) => {
            const aScore = (a.upvotes - a.downvotes) / ((Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60) + 1);
            const bScore = (b.upvotes - b.downvotes) / ((Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60) + 1);
            return bScore - aScore;
          });
          break;
        case "top":
          sortedPosts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
          break;
        case "new":
        default:
          sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      setPosts(sortedPosts);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    loadCommunity();
  }, [communityId]);

  useEffect(() => {
    if (community) {
      loadPosts();
    }
  }, [community, sortType]);

  const handleJoin = async () => {
    try {
      if (isJoined) {
        await communitiesService.leave(communityId);
        toast.success(`Left ${community.name}`);
        setCommunity(prev => ({ ...prev, memberCount: prev.memberCount - 1 }));
      } else {
        await communitiesService.join(communityId);
        toast.success(`Joined ${community.name}!`);
        setCommunity(prev => ({ ...prev, memberCount: prev.memberCount + 1 }));
      }
      setIsJoined(!isJoined);
    } catch (error) {
      toast.error("Failed to update membership");
    }
  };

  const formatMemberCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Error message={error} onRetry={loadCommunity} />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Error message="Community not found" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Community Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-8 mb-8"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            {community.iconUrl ? (
              <img
                src={community.iconUrl}
                alt={community.name}
                className="w-20 h-20 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-md">
                <ApperIcon name="Users" className="w-10 h-10 text-primary" />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {community.name}
              </h1>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                {community.description}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Users" className="w-4 h-4" />
                  <span className="font-medium">
                    {formatMemberCount(community.memberCount)} members
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  <span>
                    Created {new Date(community.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={handleJoin}
              variant={isJoined ? "outline" : "primary"}
              className="min-w-[120px]"
            >
              <ApperIcon 
                name={isJoined ? "UserMinus" : "UserPlus"} 
                className="w-4 h-4 mr-2" 
              />
              {isJoined ? "Leave" : "Join"}
            </Button>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="secondary"
              size="sm"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Sort Controls */}
      <div className="mb-6">
        <SortSelector 
          value={sortType} 
          onChange={setSortType}
        />
      </div>

      {/* Posts */}
      {postsLoading ? (
        <Loading variant="feed" />
      ) : posts.length === 0 ? (
        <Empty
          title="No posts in this community yet"
          message={`Be the first to create a post in ${community.name} and start the discussion!`}
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
        onPostCreated={() => {
          loadPosts();
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};

export default Community;