import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import VoteButtons from "@/components/molecules/VoteButtons";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import { commentsService } from "@/services/api/commentsService";
import { toast } from "react-toastify";

const Comment = ({ comment, onVote, onReply, depth = 0, maxDepth = 3 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
  const canReply = depth < maxDepth;

  const handleVote = async (commentId, voteType) => {
    try {
      await commentsService.vote(commentId, voteType);
      if (onVote) onVote();
    } catch (error) {
      throw error;
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);
      const newReply = await commentsService.create({
        postId: comment.postId,
        parentId: comment.Id.toString(),
        author: `User${Math.floor(Math.random() * 1000)}`,
        content: replyContent.trim()
      });
      
      setReplies([...replies, newReply]);
      setReplyContent("");
      setIsReplying(false);
      toast.success("Reply posted!");
      
      if (onReply) onReply(newReply);
    } catch (error) {
      toast.error("Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  const indentStyle = {
    marginLeft: depth > 0 ? `${depth * 24}px` : "0px",
    borderLeft: depth > 0 ? "2px solid #e5e7eb" : "none",
    paddingLeft: depth > 0 ? "16px" : "0px"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
      style={indentStyle}
    >
      <div className={`py-4 ${depth > 0 ? "border-l-2 border-gray-200" : ""}`}>
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm text-gray-900">
              u/{comment.author}
            </span>
            <span className="text-xs text-gray-500">
              {timeAgo}
            </span>
            {depth > 0 && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                Level {depth}
              </span>
            )}
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon 
              name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
              className="w-4 h-4" 
            />
          </button>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Comment Content */}
              <div className="flex items-start space-x-3">
                <VoteButtons
                  upvotes={comment.upvotes}
                  downvotes={comment.downvotes}
                  onVote={handleVote}
                  itemId={comment.Id}
                  orientation="vertical"
                  size="sm"
                />
                
                <div className="flex-1">
                  <p className="text-gray-800 leading-relaxed mb-3">
                    {comment.content}
                  </p>
                  
                  {/* Comment Actions */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {canReply && (
                      <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="flex items-center space-x-1 hover:text-secondary transition-colors"
                      >
                        <ApperIcon name="Reply" className="w-3 h-3" />
                        <span>Reply</span>
                      </button>
                    )}
                    
                    <button className="flex items-center space-x-1 hover:text-secondary transition-colors">
                      <ApperIcon name="Share2" className="w-3 h-3" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Reply Form */}
              <AnimatePresence>
                {isReplying && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-14"
                  >
                    <form onSubmit={handleReplySubmit} className="space-y-3">
                      <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        rows={3}
                        className="text-sm"
                      />
                      <div className="flex items-center space-x-2">
                        <Button 
                          type="submit" 
                          size="sm"
                          disabled={!replyContent.trim() || submitting}
                        >
                          {submitting ? "Posting..." : "Reply"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setIsReplying(false);
                            setReplyContent("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Nested Replies */}
              {replies.length > 0 && showReplies && (
                <div className="space-y-2">
                  {replies.map((reply) => (
                    <Comment
                      key={reply.Id}
                      comment={reply}
                      onVote={onVote}
                      onReply={onReply}
                      depth={depth + 1}
                      maxDepth={maxDepth}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const CommentThread = ({ comments = [], onVote, onReply }) => {
  // Group comments by parent-child relationships
  const topLevelComments = comments.filter(comment => !comment.parentId);
  
  if (topLevelComments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="MessageSquare" className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h3>
        <p className="text-gray-600">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {topLevelComments.map((comment) => (
        <Comment
          key={comment.Id}
          comment={comment}
          onVote={onVote}
          onReply={onReply}
          depth={0}
          maxDepth={3}
        />
      ))}
    </div>
  );
};

export default CommentThread;