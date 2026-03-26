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

/**
 * Get conversations list with role-based filtering
 * - Volunteers: Only see NGOs they have matched with (applied to their opportunities)
 * - NGOs: Only see volunteers who have applied to their opportunities
 */
export const getConversations = async (userRole) => {
  const response = await axios.get(
    `${API_BASE}/messages/conversations`,
    getAuthHeaders()
  );
  
  // Backend should handle filtering, but we can add client-side validation
  return response.data;
};

/**
 * Check if user can chat with another user based on role and match status
 * - Volunteers can only chat with NGOs they've applied to
 * - NGOs can only chat with volunteers who applied to their opportunities
 */
export const canChatWith = async (targetUserId) => {
  try {
    const response = await axios.get(
      `${API_URL}/messages/can-chat/${targetUserId}`,
      getAuthHeaders()
    );
    return response.data.canChat;
  } catch (error) {
    console.error('Error checking chat permission:', error);
    return false;
  }
};

/**
 * Get matched users for chat (role-based)
 * - For volunteers: Returns NGOs from opportunities they applied to
 * - For NGOs: Returns volunteers who applied to their opportunities
 */
export const getMatchedUsersForChat = async () => {
  const response = await axios.get(
    `${API_BASE}/messages/matched-users`,
    getAuthHeaders()
  );
  return response.data;
};
