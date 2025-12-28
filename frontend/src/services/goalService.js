import axiosInstance from "../api/axios";


const API_URL ="https://quittrack-backend.onrender.com"

// ✅ Helper to get auth header
const getConfig = () => { 
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Create or update goal
export const createOrUpdateGoal = async (goalData) => {
  const response = await axiosInstance.post(API_URL, goalData, getConfig());
  return response.data;
};
export const createGoal = createOrUpdateGoal;


// ✅ Fetch all goals
export const fetchGoals = async () => {
  const response = await axiosInstance.get(API_URL, getConfig());
  return response.data;
};

// ✅ Delete goal by ID
export const deleteGoal = async (goalId) => {
  const response = await axiosInstance.delete(`${API_URL}/${goalId}`, getConfig());
  return response.data;
};

// ✅ Update goal by ID
export const updateGoal = async (goalId, updatedData) => {
  const response = await axiosInstance.put(`${API_URL}/${goalId}`, updatedData, getConfig());
  return response.data;
};
