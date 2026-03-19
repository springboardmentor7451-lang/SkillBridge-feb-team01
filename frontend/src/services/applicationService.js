import api from "./api";

// Apply
export const applyForOpportunity = async (opportunityId) => {
  try {
    const res = await api.post("/applications", {
      opportunity_id: opportunityId,
    });
    return res;
  } catch (error) {
    throw error.response?.data?.message || "Application failed";
  }
};

// Get my applications
export const getMyApplications = async () => {
  try {
    const res = await api.get("/applications/my");
    return res;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch applications";
  }
};

// NGO accept/reject
export const manageApplication = async (applicationId, status) => {
  try {
    const res = await api.put(
      `/applications/${applicationId}/status`,
      { status }
    );
    return res;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update status";
  }
};