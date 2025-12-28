import React, { useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

const SetGoalPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [currentBaseline, setCurrentBaseline] = useState("");
  const [targetCigarettes, setTargetCigarettes] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState("");

  const saveGoal = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not authenticated");
      return;
    }

    if (
      !title ||
      !currentBaseline ||
      !targetCigarettes ||
      !targetDate
    ) {
      setError("All fields are required");
      return;
    }

    const baseline = Number(currentBaseline);
    const target = Number(targetCigarettes);

    if (Number.isNaN(baseline) || Number.isNaN(target)) {
      setError("Invalid numeric values");
      return;
    }

    if (target > baseline) {
      setError("Target must be less than or equal to baseline");
      return;
    }

    try {
      await axiosInstance.post(
        "/api/goals",
        {
          title,
          currentBaseline: baseline,
          targetCigarettes: target,
          targetDate,
        }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Save goal error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to save goal");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8">

        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Set Your Smoking Reduction Goal
        </h2>

        {error && (
          <p className="text-red-600 mb-4 text-center">{error}</p>
        )}

        <form onSubmit={saveGoal} className="space-y-4">

          <input
            className="w-full border p-2 rounded"
            placeholder="Goal Title (e.g., Reduce to 2/day)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            min="1"
            className="w-full border p-2 rounded"
            placeholder="Current cigarettes per day"
            value={currentBaseline}
            onChange={(e) => setCurrentBaseline(e.target.value)}
          />

          <input
            type="number"
            min="0"
            className="w-full border p-2 rounded"
            placeholder="Target cigarettes per day"
            value={targetCigarettes}
            onChange={(e) => setTargetCigarettes(e.target.value)}
          />

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />

          <button
            className="w-full p-3 text-white bg-green-600 hover:bg-green-700 rounded-xl font-semibold"
            type="submit"
          >
            Save Goal
          </button>

        </form>
      </div>
    </div>
  );
};

export default SetGoalPage;
