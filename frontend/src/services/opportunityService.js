import api from "./api";

// Get all opportunities (with filters)
export const getOpportunities = async (params = {}) => {
  try {
    const res = await api.get("/opportunities", { params });
    return res;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch opportunities";
  }
};

// Get single opportunity
export const getOpportunityById = async (id) => {
  try {
    const res = await api.get(`/opportunities/${id}`);
    return res;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch opportunity";
  }
};