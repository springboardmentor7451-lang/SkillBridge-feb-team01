import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getMyApplications = async () => {
  const response = await axios.get(
    `${API_BASE}/applications/my`,
    getAuthHeaders()
  );
  return response.data;
};

export const getApplicationsByOpportunity = async (opportunityId) => {
  const response = await axios.get(
    `${API_BASE}/applications/opportunity/${opportunityId}`,
    getAuthHeaders()
  );
  return response.data;
};

export const acceptApplication = async (applicationId) => {
  const response = await axios.put(
    `${API_BASE}/applications/${applicationId}/accept`,
    {},
    getAuthHeaders()
  );
  return response.data;
};

export const rejectApplication = async (applicationId) => {
  const response = await axios.put(
    `${API_BASE}/applications/${applicationId}/reject`,
    {},
    getAuthHeaders()
  );
  return response.data;
};
