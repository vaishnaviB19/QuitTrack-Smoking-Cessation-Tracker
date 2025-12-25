import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const DashboardGoalCard = () => {
  const [goal, setGoal] = useState(null);

  useEffect(() => {
    axios.get("/api/goals")
      .then(res => setGoal(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!goal) return <div>No goal set yet.</div>;

  const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="card p-4 shadow-md bg-white rounded-lg">
      <h3 className="text-lg font-bold">{goal.title}</h3>
      <p>Target Cigarettes: {goal.targetCigarettes}</p>
      <p>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>
      <p>Days Left: {daysLeft}</p>
      <Link to="/goal" className="text-blue-500 underline mt-2 block">
        Edit Goal
      </Link>
    </div>
  );
};

export default DashboardGoalCard;
