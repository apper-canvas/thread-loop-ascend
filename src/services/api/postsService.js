import postsData from "@/services/mockData/posts.json";

let posts = [...postsData];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const postsService = {
  async getAll() {
    await delay(300);
    // Sort by createdAt descending (newest first)
    return posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay(200);
    const post = posts.find(p => p.Id === parseInt(id));
    if (!post) {
      throw new Error("Post not found");
    }
    return { ...post };
  },

  async getByCommunity(communityId) {
    await delay(300);
    const communityPosts = posts.filter(p => p.communityId === communityId);
    return communityPosts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getBySort(sortType) {
    await delay(300);
    let sortedPosts = [...posts];
    
    switch (sortType) {
      case "hot":
        // Simple hot algorithm: (upvotes - downvotes) / hours since posted
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
  },

  async search(query) {
    await delay(250);
    const searchResults = posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
    );
    return searchResults.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(postData) {
    await delay(400);
    const newPost = {
      Id: Math.max(...posts.map(p => p.Id)) + 1,
      title: postData.title,
      content: postData.content,
      imageUrl: postData.imageUrl || null,
      author: postData.author,
      communityId: postData.communityId,
      upvotes: 1, // Creator automatically upvotes
      downvotes: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    posts.push(newPost);
    return { ...newPost };
  },

  async update(id, updateData) {
    await delay(300);
    const index = posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Post not found");
    }
    
    posts[index] = {
      ...posts[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...posts[index] };
  },

  async vote(id, voteType) {
    await delay(200);
    const post = posts.find(p => p.Id === parseInt(id));
    if (!post) {
      throw new Error("Post not found");
    }
    
    if (voteType === "up") {
      post.upvotes += 1;
    } else if (voteType === "down") {
      post.downvotes += 1;
    }
    
    return { ...post };
  },

  async delete(id) {
    await delay(300);
    const index = posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Post not found");
    }
    
    const deletedPost = posts.splice(index, 1)[0];
    return { ...deletedPost };
  }
};