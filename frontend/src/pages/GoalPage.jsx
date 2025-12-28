// src/pages/GoalPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const GoalPage = () => {
  const { goal, dashboard } = useAppContext();

  /* ===============================
     NO GOAL
  =============================== */
  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            No goal set yet
          </h2>
          <p className="text-gray-600 mb-6">
            Setting a daily target helps you stay consistent.
          </p>
          <Link
            to="/setgoal"
            className="px-6 py-2 bg-amber-500 text-white rounded-xl font-semibold"
          >
            Create Your First Goal
          </Link>
        </div>
      </div>
    );
  }

  /* ===============================
     GOAL STATUS (MODEL-FIRST)
  =============================== */
  let goalStatus = "ACTIVE"; // ACTIVE | COMPLETED | MISSED

  const todayProgress = dashboard?.today?.progress ?? 0;
  const goalEndDate = new Date(goal.targetDate);
  const todayDate = new Date();

  if (goal.completed || todayProgress >= 100) {
    goalStatus = "COMPLETED";
  } else if (!goal.isActive || goalEndDate < todayDate) {
    goalStatus = "MISSED";
  }

  /* ===============================
     DATE HELPERS
  =============================== */
  const formatDate = (date) =>
    new Date(date).toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-8 text-center">

        {/* ================= ACTIVE GOAL ================= */}
        {goalStatus === "ACTIVE" && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-green-700">
              🎯 Your Current Goal
            </h1>

            <div className="text-left space-y-3 mb-6 text-gray-800">
              <p>
                <span className="font-semibold">Title:</span> {goal.title}
              </p>

              <p>
                <span className="font-semibold">Baseline:</span>{" "}
                {goal.currentBaseline} / day
              </p>

              <p>
                <span className="font-semibold">Daily Target:</span>{" "}
                {goal.targetCigarettes} / day
              </p>

              <p>
                <span className="font-semibold">Start Date:</span>{" "}
                {formatDate(goal.startDate)}
              </p>

              <p>
                <span className="font-semibold">Target Date:</span>{" "}
                {formatDate(goal.targetDate)}
              </p>
            </div>

            <Link
              to="/setgoal"
              className="block w-full py-2 bg-amber-500 text-white rounded-xl font-semibold"
            >
              Edit Goal
            </Link>
          </>
        )}

        {/* ================= GOAL COMPLETED ================= */}
        {goalStatus === "COMPLETED" && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-green-700">
              🎉 Goal Completed!
            </h1>

            <p className="text-gray-700 mb-4">
              You successfully achieved your goal of reducing
              smoking to <strong>{goal.targetCigarettes}</strong> per day.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
              <p><strong>Baseline:</strong> {goal.currentBaseline} / day</p>
              <p><strong>Target:</strong> {goal.targetCigarettes} / day</p>
              <p><strong>Duration:</strong> {formatDate(goal.startDate)} → {formatDate(goal.targetDate)}</p>
            </div>

            <div className="text-6xl mb-6">✅</div>

            <Link
              to="/setgoal"
              className="block w-full py-2 bg-green-600 text-white rounded-xl font-semibold"
            >
              Set New Goal
            </Link>
          </>
        )}

        {/* ================= GOAL MISSED ================= */}
        {goalStatus === "MISSED" && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-amber-600">
              ⚠️ Goal Missed
            </h1>

            <p className="text-gray-700 mb-4">
              This goal period has ended, but every attempt builds progress.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <p><strong>Baseline:</strong> {goal.currentBaseline} / day</p>
              <p><strong>Target:</strong> {goal.targetCigarettes} / day</p>
              <p><strong>Duration:</strong> {formatDate(goal.startDate)} → {formatDate(goal.targetDate)}</p>
            </div>

            <div className="text-6xl mb-6">🔄</div>

            <Link
              to="/setgoal"
              className="block w-full py-2 bg-amber-500 text-white rounded-xl font-semibold"
            >
              Set New Goal
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default GoalPage;
