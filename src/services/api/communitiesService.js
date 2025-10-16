import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const communitiesService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("community_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "member_count_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "icon_url_c" } }
        ],
        orderBy: [
          {
            fieldName: "member_count_c",
            sorttype: "DESC"
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(community => ({
        Id: community.Id,
        name: community.name_c,
        description: community.description_c,
        memberCount: community.member_count_c || 0,
        createdAt: community.created_at_c,
        iconUrl: community.icon_url_c
      }));
    } catch (error) {
      console.error("Error fetching communities:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById("community_c", parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "member_count_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "icon_url_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const community = response.data;
      return {
        Id: community.Id,
        name: community.name_c,
        description: community.description_c,
        memberCount: community.member_count_c || 0,
        createdAt: community.created_at_c,
        iconUrl: community.icon_url_c
      };
    } catch (error) {
      console.error(`Error fetching community ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getPopular() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("community_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "member_count_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "icon_url_c" } }
        ],
        orderBy: [
          {
            fieldName: "member_count_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 10,
          offset: 0
        }
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(community => ({
        Id: community.Id,
        name: community.name_c,
        description: community.description_c,
        memberCount: community.member_count_c || 0,
        createdAt: community.created_at_c,
        iconUrl: community.icon_url_c
      }));
    } catch (error) {
      console.error("Error fetching popular communities:", error?.response?.data?.message || error);
      return [];
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords("community_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "member_count_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "icon_url_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "name_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "description_c",
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
            fieldName: "member_count_c",
            sorttype: "DESC"
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(community => ({
        Id: community.Id,
        name: community.name_c,
        description: community.description_c,
        memberCount: community.member_count_c || 0,
        createdAt: community.created_at_c,
        iconUrl: community.icon_url_c
      }));
    } catch (error) {
      console.error("Error searching communities:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(communityData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        name_c: communityData.name,
        description_c: communityData.description,
        member_count_c: 1,
        created_at_c: new Date().toISOString()
      };

      if (communityData.iconUrl) {
        payload.icon_url_c = communityData.iconUrl;
      }

      const response = await apperClient.createRecord("community_c", {
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
          console.error(`Failed to create community:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        const created = response.results[0].data;
        return {
          Id: created.Id,
          name: created.name_c,
          description: created.description_c,
          memberCount: created.member_count_c || 0,
          createdAt: created.created_at_c,
          iconUrl: created.icon_url_c
        };
      }
    } catch (error) {
      console.error("Error creating community:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        Id: parseInt(id)
      };

      if (updateData.name) {
        payload.name_c = updateData.name;
      }
      if (updateData.description) {
        payload.description_c = updateData.description;
      }
      if (updateData.memberCount !== undefined) {
        payload.member_count_c = updateData.memberCount;
      }
      if (updateData.iconUrl !== undefined) {
        payload.icon_url_c = updateData.iconUrl;
      }

      const response = await apperClient.updateRecord("community_c", {
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
          console.error(`Failed to update community:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          name: updated.name_c,
          description: updated.description_c,
          memberCount: updated.member_count_c || 0,
          createdAt: updated.created_at_c,
          iconUrl: updated.icon_url_c
        };
      }
    } catch (error) {
      console.error("Error updating community:", error?.response?.data?.message || error);
      return null;
    }
  },

  async join(id) {
    try {
      const community = await this.getById(id);
      if (!community) {
        throw new Error("Community not found");
      }

      return await this.update(id, {
        memberCount: community.memberCount + 1
      });
    } catch (error) {
      console.error("Error joining community:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async leave(id) {
    try {
      const community = await this.getById(id);
      if (!community) {
        throw new Error("Community not found");
      }

      return await this.update(id, {
        memberCount: Math.max(1, community.memberCount - 1)
      });
    } catch (error) {
      console.error("Error leaving community:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord("community_c", {
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
          console.error(`Failed to delete community:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting community:", error?.response?.data?.message || error);
      return false;
    }
  }
};