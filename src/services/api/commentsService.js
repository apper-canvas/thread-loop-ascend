import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const commentsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("comment_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "author_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "upvotes_c" } },
          { field: { Name: "downvotes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "depth_c" } },
          { field: { Name: "parent_id_c" } },
          { field: { Name: "post_id_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(comment => ({
        Id: comment.Id,
        author: comment.author_c,
        content: comment.content_c,
        upvotes: comment.upvotes_c || 0,
        downvotes: comment.downvotes_c || 0,
        createdAt: comment.created_at_c,
        depth: comment.depth_c || 0,
        parentId: comment.parent_id_c?.Id || null,
        postId: comment.post_id_c?.Id || null
      }));
    } catch (error) {
      console.error("Error fetching comments:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById("comment_c", parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "author_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "upvotes_c" } },
          { field: { Name: "downvotes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "depth_c" } },
          { field: { Name: "parent_id_c" } },
          { field: { Name: "post_id_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const comment = response.data;
      return {
        Id: comment.Id,
        author: comment.author_c,
        content: comment.content_c,
        upvotes: comment.upvotes_c || 0,
        downvotes: comment.downvotes_c || 0,
        createdAt: comment.created_at_c,
        depth: comment.depth_c || 0,
        parentId: comment.parent_id_c?.Id || null,
        postId: comment.post_id_c?.Id || null
      };
    } catch (error) {
      console.error(`Error fetching comment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByPost(postId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("comment_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "author_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "upvotes_c" } },
          { field: { Name: "downvotes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "depth_c" } },
          { field: { Name: "parent_id_c" } },
          { field: { Name: "post_id_c" } }
        ],
        where: [
          {
            FieldName: "post_id_c",
            Operator: "EqualTo",
            Values: [parseInt(postId)]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "ASC"
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(comment => ({
        Id: comment.Id,
        author: comment.author_c,
        content: comment.content_c,
        upvotes: comment.upvotes_c || 0,
        downvotes: comment.downvotes_c || 0,
        createdAt: comment.created_at_c,
        depth: comment.depth_c || 0,
        parentId: comment.parent_id_c?.Id || null,
        postId: comment.post_id_c?.Id || null
      }));
    } catch (error) {
      console.error("Error fetching comments by post:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getReplies(parentId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("comment_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "author_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "upvotes_c" } },
          { field: { Name: "downvotes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "depth_c" } },
          { field: { Name: "parent_id_c" } },
          { field: { Name: "post_id_c" } }
        ],
        where: [
          {
            FieldName: "parent_id_c",
            Operator: "EqualTo",
            Values: [parseInt(parentId)]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "ASC"
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(comment => ({
        Id: comment.Id,
        author: comment.author_c,
        content: comment.content_c,
        upvotes: comment.upvotes_c || 0,
        downvotes: comment.downvotes_c || 0,
        createdAt: comment.created_at_c,
        depth: comment.depth_c || 0,
        parentId: comment.parent_id_c?.Id || null,
        postId: comment.post_id_c?.Id || null
      }));
    } catch (error) {
      console.error("Error fetching replies:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(commentData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        author_c: commentData.author,
        content_c: commentData.content,
        upvotes_c: 1,
        downvotes_c: 0,
        created_at_c: new Date().toISOString(),
        depth_c: commentData.depth || 0,
        post_id_c: parseInt(commentData.postId)
      };

      if (commentData.parentId) {
        payload.parent_id_c = parseInt(commentData.parentId);
      }

      const response = await apperClient.createRecord("comment_c", {
        records: [payload]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create comment:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        const created = response.results[0].data;
        return {
          Id: created.Id,
          author: created.author_c,
          content: created.content_c,
          upvotes: created.upvotes_c || 0,
          downvotes: created.downvotes_c || 0,
          createdAt: created.created_at_c,
          depth: created.depth_c || 0,
          parentId: created.parent_id_c?.Id || null,
          postId: created.post_id_c?.Id || null
        };
      }
    } catch (error) {
      console.error("Error creating comment:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        Id: parseInt(id)
      };

      if (updateData.content) {
        payload.content_c = updateData.content;
      }
      if (updateData.upvotes !== undefined) {
        payload.upvotes_c = updateData.upvotes;
      }
      if (updateData.downvotes !== undefined) {
        payload.downvotes_c = updateData.downvotes;
      }

      const response = await apperClient.updateRecord("comment_c", {
        records: [payload]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update comment:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          author: updated.author_c,
          content: updated.content_c,
          upvotes: updated.upvotes_c || 0,
          downvotes: updated.downvotes_c || 0,
          createdAt: updated.created_at_c,
          depth: updated.depth_c || 0,
          parentId: updated.parent_id_c?.Id || null,
          postId: updated.post_id_c?.Id || null
        };
      }
    } catch (error) {
      console.error("Error updating comment:", error?.response?.data?.message || error);
      return null;
    }
  },

  async vote(id, voteType) {
    try {
      const comment = await this.getById(id);
      if (!comment) {
        throw new Error("Comment not found");
      }

      const updateData = {};
      if (voteType === "up") {
        updateData.upvotes = comment.upvotes + 1;
      } else if (voteType === "down") {
        updateData.downvotes = comment.downvotes + 1;
      }

      return await this.update(id, updateData);
    } catch (error) {
      console.error("Error voting on comment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord("comment_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete comment:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting comment:", error?.response?.data?.message || error);
      return false;
    }
  }
};