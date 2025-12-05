// src/pages/GoalPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const GoalPage = () => {
  const { goal } = useAppContext();

  if (!goal) {
    return (
      <div className="text-center p-10">
        <h2 className="text-xl font-semibold">No goal set yet.</h2>
        <Link to="/setgoal" className="text-blue-600 underline">
          Click here to create your first goal
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 shadow rounded-xl bg-white">
      <h1 className="text-2xl font-bold mb-4">Your Goal</h1>

      <p><strong>Title:</strong> {goal.title}</p>
      <p><strong>Baseline:</strong> {goal.currentBaseline} / day</p>
      <p><strong>Daily Target:</strong> {goal.targetCigarettes} / day</p>
      <p><strong>Target Date:</strong> {goal.targetDate.split("T")[0]}</p>

      <Link
        to="/setgoal"
        className="block text-center mt-5 p-2 bg-blue-600 text-white rounded-lg"
      >
        Edit Goal
      </Link>
    </div>
  );
};

export default GoalPage;
