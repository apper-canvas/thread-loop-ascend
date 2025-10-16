import communitiesData from "@/services/mockData/communities.json";

let communities = [...communitiesData];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const communitiesService = {
  async getAll() {
    await delay(200);
    return [...communities].sort((a, b) => b.memberCount - a.memberCount);
  },

  async getById(id) {
    await delay(150);
    const community = communities.find(c => c.Id === parseInt(id));
    if (!community) {
      throw new Error("Community not found");
    }
    return { ...community };
  },

  async getPopular() {
    await delay(250);
    return [...communities]
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, 10);
  },

  async search(query) {
    await delay(200);
    const searchResults = communities.filter(community => 
      community.name.toLowerCase().includes(query.toLowerCase()) ||
      community.description.toLowerCase().includes(query.toLowerCase())
    );
    return searchResults.sort((a, b) => b.memberCount - a.memberCount);
  },

  async create(communityData) {
    await delay(400);
    const newCommunity = {
      Id: Math.max(...communities.map(c => c.Id)) + 1,
      name: communityData.name,
      description: communityData.description,
      memberCount: 1, // Creator is first member
      createdAt: new Date().toISOString(),
      iconUrl: communityData.iconUrl || null
    };
    
    communities.push(newCommunity);
    return { ...newCommunity };
  },

  async update(id, updateData) {
    await delay(300);
    const index = communities.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Community not found");
    }
    
    communities[index] = {
      ...communities[index],
      ...updateData
    };
    
    return { ...communities[index] };
  },

  async join(id) {
    await delay(250);
    const community = communities.find(c => c.Id === parseInt(id));
    if (!community) {
      throw new Error("Community not found");
    }
    
    community.memberCount += 1;
    return { ...community };
  },

  async leave(id) {
    await delay(250);
    const community = communities.find(c => c.Id === parseInt(id));
    if (!community) {
      throw new Error("Community not found");
    }
    
    community.memberCount = Math.max(1, community.memberCount - 1);
    return { ...community };
  },

  async delete(id) {
    await delay(300);
    const index = communities.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Community not found");
    }
    
    const deletedCommunity = communities.splice(index, 1)[0];
    return { ...deletedCommunity };
  }
};