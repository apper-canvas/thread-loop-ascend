import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import VoteButtons from "@/components/molecules/VoteButtons";
import CommentThread from "@/components/organisms/CommentThread";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { postsService } from "@/services/api/postsService";
import { commentsService } from "@/services/api/commentsService";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadPost = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await postsService.getById(id);
      setPost(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      const data = await commentsService.getByPost(id);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
    loadComments();
  }, [id]);

  const handleVote = async (postId, voteType) => {
    try {
      await postsService.vote(postId, voteType);
      loadPost(); // Refresh post data
    } catch (error) {
      throw error;
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      await commentsService.create({
        postId: id,
        author: `User${Math.floor(Math.random() * 1000)}`,
        content: newComment.trim()
      });
      
      setNewComment("");
      loadComments(); // Refresh comments
      toast.success("Comment posted!");
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
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
        <Error message={error} onRetry={loadPost} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Error message="Post not found" onRetry={() => navigate("/")} />
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-primary"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Feed
        </Button>
      </motion.div>

      {/* Post Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8"
      >
        <div className="p-8">
          <div className="flex items-start space-x-6">
            {/* Vote Buttons */}
            <div className="flex-shrink-0">
              <VoteButtons
                upvotes={post.upvotes}
                downvotes={post.downvotes}
                onVote={handleVote}
                itemId={post.Id}
                orientation="vertical"
                size="lg"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Post Meta */}
              <div className="flex items-center space-x-3 mb-4">
                <Link 
                  to={`/r/${post.communityId}`}
                  className="text-secondary font-semibold hover:text-secondary/80 transition-colors"
                >
                  r/community
                </Link>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  Posted by u/{post.author}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{timeAgo}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Image */}
              {post.imageUrl && (
                <div className="mb-6">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full max-w-2xl rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-6">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-6 text-gray-500 border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="MessageSquare" className="w-5 h-5" />
                  <span className="font-medium">{comments.length} comments</span>
                </div>
                
                <button className="flex items-center space-x-2 hover:text-secondary transition-colors">
                  <ApperIcon name="Share2" className="w-5 h-5" />
                  <span>Share</span>
                </button>
                
                <button className="flex items-center space-x-2 hover:text-secondary transition-colors">
                  <ApperIcon name="Bookmark" className="w-5 h-5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Comment Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="MessageSquare" className="w-5 h-5 mr-2 text-primary" />
          Add a Comment
        </h3>
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            rows={4}
            className="w-full"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!newComment.trim() || submittingComment}
              className="min-w-[120px]"
            >
              {submittingComment ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                  Comment
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <ApperIcon name="MessageSquare" className="w-5 h-5 mr-2 text-secondary" />
          Comments ({comments.length})
        </h3>
        
        {commentsLoading ? (
          <Loading variant="comments" />
        ) : (
          <div className="thread-container">
            <CommentThread 
              comments={comments} 
              onVote={loadComments}
              onReply={loadComments}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PostDetail;