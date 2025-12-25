// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Always fetch user
        const userRes = await api.get("/user/profile");
        setUser(userRes.data.user || userRes.data);

        // Skip goal fetch on /setgoal
        if (window.location.pathname === "/setgoal") {
          setLoading(false);
          return;
        }

        // Fetch active goal
        const goalRes = await api.get("/goals");
        setGoal(goalRes.data);

      } catch (err) {
        console.log("Context Error:", err);

        // Token expired → logout
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }

        // No active goal → new user
        if (err.response?.status === 404) {
          setGoal(null);

          if (window.location.pathname !== "/setgoal") {
            navigate("/setgoal");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

const saveGoal = async (goalData) => {
  try {
    const res = await api.put("/goals", goalData);
    setGoal(res.data);
    return res.data;
  } catch (err) {
    console.error("SAVE GOAL ERROR:", err);
    throw err;
  }
};



  return (
    <AppContext.Provider
      value={{
        user,
        goal,
        saveGoal,
        loading,
      }}
    >
      {!loading && children}
    </AppContext.Provider>
  );
};

export default AppProvider;
