// src/pages/SetGoalPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SetGoalPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [targetCigarettes, setTargetCigarettes] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState("");

  const saveGoal = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/goals",
        { title, targetCigarettes, targetDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh dashboard on next load
      window.dispatchEvent(new Event("storage"));

      navigate("/dashboard");

    } catch (err) {
      setError("Failed to save goal");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold mb-4">Set Your Goal</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={saveGoal} className="space-y-4">

        <input
          className="w-full border p-2 rounded"
          placeholder="Goal Title (e.g., Reduce to 2/day)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Target cigarettes per day"
          value={targetCigarettes}
          onChange={(e) => setTargetCigarettes(e.target.value)}
          required
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
        />

        <button
          className="w-full p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
          type="submit"
        >
          Save Goal
        </button>
      </form>
    </div>
  );
};

export default SetGoalPage;
