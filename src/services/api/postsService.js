import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const postsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("post_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "community_id_c" } },
          { field: { Name: "upvotes_c" } },
          { field: { Name: "downvotes_c" } },
          { field: { Name: "comment_count_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(post => ({
        Id: post.Id,
        title: post.title_c,
        content: post.content_c,
        imageUrl: post.image_url_c,
        author: post.author_c,
        communityId: post.community_id_c?.Id || null,
        upvotes: post.upvotes_c || 0,
        downvotes: post.downvotes_c || 0,
        commentCount: post.comment_count_c || 0,
        createdAt: post.created_at_c,
        updatedAt: post.updated_at_c
      }));
    } catch (error) {
      console.error("Error fetching posts:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById("post_c", parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "community_id_c" } },
          { field: { Name: "upvotes_c" } },
          { field: { Name: "downvotes_c" } },
          { field: { Name: "comment_count_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const post = response.data;
      return {
        Id: post.Id,
        title: post.title_c,
        content: post.content_c,
        imageUrl: post.image_url_c,
        author: post.author_c,
        communityId: post.community_id_c?.Id || null,
        upvotes: post.upvotes_c || 0,
        downvotes: post.downvotes_c || 0,
        commentCount: post.comment_count_c || 0,
        createdAt: post.created_at_c,
        updatedAt: post.updated_at_c
      };
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByCommunity(communityId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("post_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "community_id_c" } },
          { field: { Name: "upvotes_c" } },
          { field: { Name: "downvotes_c" } },
          { field: { Name: "comment_count_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "community_id_c",
            Operator: "EqualTo",
            Values: [parseInt(communityId)]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(post => ({
        Id: post.Id,
        title: post.title_c,
        content: post.content_c,
        imageUrl: post.image_url_c,
        author: post.author_c,
        communityId: post.community_id_c?.Id || null,
        upvotes: post.upvotes_c || 0,
        downvotes: post.downvotes_c || 0,
        commentCount: post.comment_count_c || 0,
        createdAt: post.created_at_c,
        updatedAt: post.updated_at_c
      }));
    } catch (error) {
      console.error("Error fetching posts by community:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getBySort(sortType) {
    try {
      const posts = await this.getAll();
      let sortedPosts = [...posts];

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

      return sortedPosts;
    } catch (error) {
      console.error("Error sorting posts:", error?.response?.data?.message || error);
      return [];
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("post_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "community_id_c" } },
          { field: { Name: "upvotes_c" } },
          { field: { Name: "downvotes_c" } },
          { field: { Name: "comment_count_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "content_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              }
            ]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(post => ({
        Id: post.Id,
        title: post.title_c,
        content: post.content_c,
        imageUrl: post.image_url_c,
        author: post.author_c,
        communityId: post.community_id_c?.Id || null,
        upvotes: post.upvotes_c || 0,
        downvotes: post.downvotes_c || 0,
        commentCount: post.comment_count_c || 0,
        createdAt: post.created_at_c,
        updatedAt: post.updated_at_c
      }));
    } catch (error) {
      console.error("Error searching posts:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(postData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        title_c: postData.title,
        content_c: postData.content,
        author_c: postData.author,
        community_id_c: parseInt(postData.communityId),
        upvotes_c: 1,
        downvotes_c: 0,
        comment_count_c: 0,
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString()
      };

      if (postData.imageUrl) {
        payload.image_url_c = postData.imageUrl;
      }

      const response = await apperClient.createRecord("post_c", {
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
          console.error(`Failed to create post:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        const created = response.results[0].data;
        return {
          Id: created.Id,
          title: created.title_c,
          content: created.content_c,
          imageUrl: created.image_url_c,
          author: created.author_c,
          communityId: created.community_id_c?.Id || null,
          upvotes: created.upvotes_c || 0,
          downvotes: created.downvotes_c || 0,
          commentCount: created.comment_count_c || 0,
          createdAt: created.created_at_c,
          updatedAt: created.updated_at_c
        };
      }
    } catch (error) {
      console.error("Error creating post:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        Id: parseInt(id),
        updated_at_c: new Date().toISOString()
      };

      if (updateData.title) {
        payload.title_c = updateData.title;
      }
      if (updateData.content) {
        payload.content_c = updateData.content;
      }
      if (updateData.imageUrl !== undefined) {
        payload.image_url_c = updateData.imageUrl;
      }
      if (updateData.upvotes !== undefined) {
        payload.upvotes_c = updateData.upvotes;
      }
      if (updateData.downvotes !== undefined) {
        payload.downvotes_c = updateData.downvotes;
      }
      if (updateData.commentCount !== undefined) {
        payload.comment_count_c = updateData.commentCount;
      }

      const response = await apperClient.updateRecord("post_c", {
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
          console.error(`Failed to update post:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          title: updated.title_c,
          content: updated.content_c,
          imageUrl: updated.image_url_c,
          author: updated.author_c,
          communityId: updated.community_id_c?.Id || null,
          upvotes: updated.upvotes_c || 0,
          downvotes: updated.downvotes_c || 0,
          commentCount: updated.comment_count_c || 0,
          createdAt: updated.created_at_c,
          updatedAt: updated.updated_at_c
        };
      }
    } catch (error) {
      console.error("Error updating post:", error?.response?.data?.message || error);
      return null;
    }
  },

  async vote(id, voteType) {
    try {
      const post = await this.getById(id);
      if (!post) {
        throw new Error("Post not found");
      }

      const updateData = {};
      if (voteType === "up") {
        updateData.upvotes = post.upvotes + 1;
      } else if (voteType === "down") {
        updateData.downvotes = post.downvotes + 1;
      }

      return await this.update(id, updateData);
    } catch (error) {
      console.error("Error voting on post:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord("post_c", {
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
          console.error(`Failed to delete post:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting post:", error?.response?.data?.message || error);
      return false;
    }
  }
};