import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { postsService } from "@/services/api/postsService";
import { communitiesService } from "@/services/api/communitiesService";

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    communityId: ""
  });
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCommunities();
    }
  }, [isOpen]);

  const loadCommunities = async () => {
    try {
      setLoading(true);
      const data = await communitiesService.getAll();
      setCommunities(data);
    } catch (error) {
      toast.error("Failed to load communities");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    } else if (formData.title.length > 300) {
      newErrors.title = "Title must be less than 300 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 20) {
      newErrors.content = "Content must be at least 20 characters";
    }

    if (!formData.communityId) {
      newErrors.communityId = "Please select a community";
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setSubmitting(true);
      
      const postData = {
        ...formData,
        author: `User${Math.floor(Math.random() * 1000)}` // Simulate current user
      };

      const newPost = await postsService.create(postData);
      
      toast.success("Post created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        content: "",
        imageUrl: "",
        communityId: ""
      });
      setErrors({});
      
      if (onPostCreated) {
        onPostCreated(newPost);
      }
      
      onClose();
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-orange-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <ApperIcon name="Plus" className="w-6 h-6 mr-2" />
                  Create New Post
                </h2>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <ApperIcon name="X" className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Community Selection */}
              <Select
                label="Choose Community"
                value={formData.communityId}
                onChange={(e) => handleInputChange("communityId", e.target.value)}
                error={errors.communityId}
                disabled={loading}
              >
                <option value="">Select a community...</option>
                {communities.map((community) => (
                  <option key={community.Id} value={community.Id}>
                    {community.name} ({community.memberCount.toLocaleString()} members)
                  </option>
                ))}
              </Select>

              {/* Title */}
              <Input
                label="Post Title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="What's your post about?"
                error={errors.title}
                className="text-lg"
              />

              {/* Content */}
              <Textarea
                label="Post Content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                rows={8}
                error={errors.content}
              />

              {/* Image URL (Optional) */}
              <Input
                label="Image URL (Optional)"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
                error={errors.imageUrl}
              />

              {/* Character Counts */}
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  Title: {formData.title.length}/300 characters
                </span>
                <span>
                  Content: {formData.content.length} characters
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || loading}
                  className="min-w-[120px]"
                >
                  {submitting ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                      Create Post
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default CreatePostModal;