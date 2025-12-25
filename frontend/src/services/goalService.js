import axios from "axios";

const API_URL = "http://localhost:5000/api/goals"; // update if using a deployed backend

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
  const response = await axios.post(API_URL, goalData, getConfig());
  return response.data;
};
export const createGoal = createOrUpdateGoal;


// ✅ Fetch all goals
export const fetchGoals = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

// ✅ Delete goal by ID
export const deleteGoal = async (goalId) => {
  const response = await axios.delete(`${API_URL}/${goalId}`, getConfig());
  return response.data;
};

// ✅ Update goal by ID
export const updateGoal = async (goalId, updatedData) => {
  const response = await axios.put(`${API_URL}/${goalId}`, updatedData, getConfig());
  return response.data;
};
