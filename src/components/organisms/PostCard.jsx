import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import VoteButtons from "@/components/molecules/VoteButtons";
import { postsService } from "@/services/api/postsService";

const PostCard = ({ post, onVote }) => {
  const navigate = useNavigate();

  const handleVote = async (postId, voteType) => {
    try {
      await postsService.vote(postId, voteType);
      if (onVote) onVote();
    } catch (error) {
      throw error;
    }
  };

  const formatContent = (content) => {
    if (content.length <= 200) return content;
    return content.substring(0, 200) + "...";
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, shadow: "0 8px 25px rgba(0,0,0,0.15)" }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Vote Buttons */}
          <div className="flex-shrink-0">
            <VoteButtons
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              onVote={handleVote}
              itemId={post.Id}
              orientation="vertical"
              size="md"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Post Meta */}
            <div className="flex items-center space-x-2 mb-3">
              <Link 
                to={`/r/${post.communityId}`}
                className="text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
              >
                r/community
              </Link>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                Posted by u/{post.author}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">{timeAgo}</span>
            </div>

            {/* Title */}
            <Link to={`/post/${post.Id}`}>
              <h2 className="text-xl font-bold text-gray-900 hover:text-primary transition-colors cursor-pointer mb-3 line-clamp-2">
                {post.title}
              </h2>
            </Link>

            {/* Content */}
            <p className="text-gray-700 mb-4 line-clamp-3">
              {formatContent(post.content)}
            </p>

            {/* Actions */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <button 
                onClick={() => navigate(`/post/${post.Id}`)}
                className="flex items-center space-x-2 hover:text-secondary transition-colors"
              >
                <ApperIcon name="MessageSquare" className="w-4 h-4" />
                <span>{post.commentCount} comments</span>
              </button>
              
              <button className="flex items-center space-x-2 hover:text-secondary transition-colors">
                <ApperIcon name="Share2" className="w-4 h-4" />
                <span>Share</span>
              </button>
              
              <button className="flex items-center space-x-2 hover:text-secondary transition-colors">
                <ApperIcon name="Bookmark" className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Thumbnail */}
          {post.imageUrl && (
            <div className="flex-shrink-0">
              <Link to={`/post/${post.Id}`}>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-24 h-24 object-cover rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;