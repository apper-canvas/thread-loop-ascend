import commentsData from "@/services/mockData/comments.json";

let comments = [...commentsData];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const commentsService = {
  async getAll() {
    await delay(250);
    return [...comments];
  },

  async getById(id) {
    await delay(150);
    const comment = comments.find(c => c.Id === parseInt(id));
    if (!comment) {
      throw new Error("Comment not found");
    }
    return { ...comment };
  },

  async getByPost(postId) {
    await delay(300);
    const postComments = comments.filter(c => c.postId === postId);
    // Sort by creation time, oldest first for natural thread flow
    return postComments.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },

  async getReplies(parentId) {
    await delay(200);
    const replies = comments.filter(c => c.parentId === parentId);
    return replies.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },

  async create(commentData) {
    await delay(350);
    const newComment = {
      Id: Math.max(...comments.map(c => c.Id)) + 1,
      postId: commentData.postId,
      parentId: commentData.parentId || null,
      author: commentData.author,
      content: commentData.content,
      upvotes: 1, // Creator automatically upvotes
      downvotes: 0,
      createdAt: new Date().toISOString(),
      depth: commentData.parentId ? 
        (comments.find(c => c.Id === parseInt(commentData.parentId))?.depth || 0) + 1 : 0
    };
    
    comments.push(newComment);
    return { ...newComment };
  },

  async update(id, updateData) {
    await delay(250);
    const index = comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    
    comments[index] = {
      ...comments[index],
      ...updateData
    };
    
    return { ...comments[index] };
  },

  async vote(id, voteType) {
    await delay(200);
    const comment = comments.find(c => c.Id === parseInt(id));
    if (!comment) {
      throw new Error("Comment not found");
    }
    
    if (voteType === "up") {
      comment.upvotes += 1;
    } else if (voteType === "down") {
      comment.downvotes += 1;
    }
    
    return { ...comment };
  },

  async delete(id) {
    await delay(250);
    const index = comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    
    const deletedComment = comments.splice(index, 1)[0];
    return { ...deletedComment };
  }
};