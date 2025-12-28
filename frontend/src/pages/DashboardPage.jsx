import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import axiosInstance from "../api/axios";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);
const DashboardPage = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    //  FETCH DASHBOARD
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const { data } = await axiosInstance.get(
        "/api/dashboard",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDashboard(data);
    } catch (err) {
      console.error("DASHBOARD FETCH ERR:", err);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    
    return () => window.removeEventListener("storage", fetchDashboard);
  }, []);

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!dashboard) return null;

    //  BACKEND-ALIGNED EXTRACTION
  const {
    name,
    currentStreak,
    longestStreak,
    smokeFreeDays,
    today,
    overall,
    todayHealthImprovement,
    goal,
    logDates = [],
    cigarettesPerDay = [],
    suggestion,
  } = dashboard;
 
  // ================= TODAY GOAL PROGRESS LOGIC =================

const todayLogged = today?.smoked || 0;

let todayProgress = 100;
let limitReached = false;

if (goal && goal.targetCigarettes > 0) {
  if (todayLogged === 0) {
    todayProgress = 100;
  } else if (todayLogged >= goal.targetCigarettes) {
    todayProgress = 0;
    limitReached = true;
  } else {
    todayProgress =
      ((goal.targetCigarettes - todayLogged) /
        goal.targetCigarettes) *
      100;
  }
}
  //  GOAL STATUS 

let goalStatus = "NONE"; 

if (goal) {
  const todayDate = new Date();
  const goalEnd = new Date(goal.targetDate);
  goalEnd.setHours(23, 59, 59, 999);

  const exceededToday =
    today?.smoked > goal.targetCigarettes;

  if (todayDate <= goalEnd) {
    // Goal still running
    goalStatus = exceededToday ? "MISSED" : "ACTIVE";
  } else {
    // Goal period ended
    goalStatus = goal.completed ? "COMPLETED" : "MISSED";
  }
}
  const overallProgress = overall?.healthProgress || 0;
  const todayCigs = today?.smoked || 0;

//  CHART DATA

  const chartData = {
    labels: logDates,
    datasets: [
      {
        label: "Cigarettes Smoked per Day",
        data: cigarettesPerDay,
        borderColor: "#4CAF50",
        backgroundColor: "#C8E6C9",
        fill: true,
        tension: 0.4,
      },
    ],
  };
  if (goal && !dashboard) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Loading goal status...</p>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex flex-col items-center flex-grow px-6 md:px-20 pt-24">
        <motion.div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl p-8 md:p-12">

          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Hi, {name || "User"}
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Here’s your progress summary
          </p>

          {/* ================= OVERALL PROGRESS ================= */}
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            Overall Health Recovery
          </h3>

          <ProgressBarAnimated
            value={overallProgress}
            colorFrom="green-400"
            colorTo="green-600"
            label="Health Progress"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

            <MetricCard
              title="Smoke-Free Days"
              value={smokeFreeDays}
              color="bg-green-500"
              textColor="text-white"
            />

            <MetricCard
              title="Cigarettes Avoided"
              value={overall?.cigarettesAvoided || 0}
              color="bg-green-600"
              textColor="text-white"
            />

            <MetricCard
              title="Money Saved"
              value={`₹${overall?.savings?.toFixed(0) || 0}`}
              color="bg-green-700"
              textColor="text-white"
            />

            <MetricCard
              title="Overall Health Recovery"
              value={`${overallProgress.toFixed(1)}%`}
              color="bg-green-800"
              textColor="text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <MetricCard
              title="Today’s Cigarettes"
              value={todayCigs}
              color="bg-amber-400"
              textColor="text-white"
            />

            <MetricCard
              title="Current Streak"
              value={`${currentStreak} days`}
              color="bg-amber-500"
              textColor="text-white"
            />

            <MetricCard
              title="Longest Streak"
              value={`${longestStreak} days`}
              color="bg-amber-600"
              textColor="text-white"
            />
          </div>

<h3 className="text-2xl font-bold mb-4 text-gray-900">
  Today’s Goal Progress
</h3>

<div className="bg-gradient-to-r from-amber-50 to-green-50 rounded-3xl p-6 shadow-xl mb-10 text-center">

  {/* ================= ACTIVE GOAL ================= */}
  {goalStatus === "ACTIVE" && goal && (
  <>
    <h3 className="text-2xl font-bold mb-3 text-green-800">
      {goal.title}
    </h3>

    <p className="text-gray-700 mb-1">
      Daily Target:{" "}
      <span className="font-semibold">
        {goal.targetCigarettes}
      </span>
    </p>

    <p className="text-gray-700 mb-1">
      Smoked Today:{" "}
      <span className="font-semibold">
        {todayLogged}
      </span>
    </p>

    <p className="text-gray-700 mb-4">
      Ends On:{" "}
      <span className="font-semibold">
        {new Date(goal.targetDate).toLocaleDateString()}
      </span>
    </p>

    {limitReached ? (
      <p className="text-red-600 font-semibold mb-4">
        Today’s limit has been reached
      </p>
    ) : (
      <ProgressBarAnimated
        value={todayProgress}
        colorFrom="green-400"
        colorTo="green-600"
        label="Today's Target Completion"
      />
    )}

    <Link
      to="/setgoal"
      className="inline-block mt-3 px-4 py-2 bg-amber-400 text-white rounded-xl"
    >
      Edit Goal
    </Link>
  </>
)}


  {/* ================= GOAL COMPLETED ================= */}
  {goalStatus === "COMPLETED" && (
    <>
      <h3 className="text-3xl font-bold mb-3 text-green-700">
        🎉 Goal Completed!
      </h3>

      <p className="text-gray-700 mb-4">
        You successfully achieved your target of{" "}
        <strong>{goal.targetCigarettes}</strong> cigarettes per day.
      </p>

      <div className="text-6xl mb-4">✅</div>

      <Link
        to="/setgoal"
        className="inline-block px-4 py-2 bg-green-600 text-white rounded-xl"
      >
        Set New Goal
      </Link>
    </>
  )}

  {/* ================= GOAL MISSED ================= */}
  {goalStatus === "MISSED" && (
    <>
      <h3 className="text-3xl font-bold mb-3 text-amber-700">
        ⚠️ Goal Missed
      </h3>

      <p className="text-gray-700 mb-4">
        This goal period has ended. Don’t worry — learning and restarting is
        part of progress.
      </p>

      <div className="text-6xl mb-4">🔄</div>

      <Link
        to="/setgoal"
        className="inline-block px-4 py-2 bg-amber-500 text-white rounded-xl"
      >
        Set New Goal
      </Link>
    </>
  )}

  {/* ================= NO GOAL ================= */}
  {goalStatus === "NONE" && (
    <>
      <p className="text-gray-700 mb-4">
        No active goal set yet.
      </p>

      <Link
        to="/setgoal"
        className="inline-block px-4 py-2 bg-amber-400 text-white rounded-xl"
      >
        Set Goal
      </Link>
    </>
  )}

</div>


          {/* ================= GRAPH ================= */}
          <div className="bg-gray-50 rounded-2xl p-6 shadow-lg mb-10">
            <h3 className="text-gray-900 font-semibold mb-4">
              Smoking Pattern Over Time
            </h3>
            <Line data={chartData} options={{ plugins: { legend: { display: false } } }} />
          </div>

          {/* ================= MOTIVATION ================= */}
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-2xl px-6 py-4 text-gray-700 text-center italic">
            {suggestion || "Every controlled day is a win. Keep going."}
          </div>

        </motion.div>
      </main>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const MetricCard = ({ title, value, color, textColor }) => (
  <div className={`${color} ${textColor} rounded-2xl p-6 text-center shadow-lg`}>
    <h3 className="font-semibold mb-2 opacity-90">{title}</h3>
    <p className="text-4xl font-bold">{value}</p>
  </div>
);

const ProgressBarAnimated = ({ value, colorFrom, colorTo, label }) => {
  const safeValue = Math.max(0, Math.min(100, Number(value)));

  return (
    <div className="mb-6">
      {label && <p className="font-semibold text-gray-800 mb-2">{label}</p>}
      <div className="w-full bg-gray-200 h-6 rounded-full relative overflow-hidden">
        <motion.div
          className={`bg-gradient-to-r from-${colorFrom} to-${colorTo} h-6 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 1.2 }}
        />
        <span className="absolute top-0 left-3 text-sm font-bold text-white">
          {safeValue.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default DashboardPage;
