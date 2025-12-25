import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Auto-refresh when logs are updated
  useEffect(() => {
    const onRefresh = () => fetchDashboard();
    window.addEventListener("storage", onRefresh);
    return () => window.removeEventListener("storage", onRefresh);
  }, []);

  // Fetch Dashboard
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const { data } = await axios.get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDashboard(data);
    } catch (err) {
      console.log("DASHBOARD FETCH ERR:", err);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  // Extract backend values
  const {
    name,
    daysSinceQuit,
    currentStreak,
    longestStreak,
    overall = {},
    goal = null,
    hybrid = {},
    logDates = [],
    cigarettesPerDay = [],
    suggestion,
  } = dashboard;

  const overallProgress = overall?.healthProgress || hybrid?.overallProgress || 0;

  // Today’s cigarettes
  const today = new Date().toISOString().slice(0, 10);
  const todayCigs = logDates.includes(today)
    ? cigarettesPerDay[logDates.indexOf(today)]
    : 0;

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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex flex-col items-center flex-grow px-6 md:px-20 pt-24">
        <motion.div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl p-8 md:p-12">

          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Hi, {name || "User"} 👋
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Here’s your progress summary
          </p>

          {/* ------------------ OVERALL PROGRESS ------------------ */}
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Overall Progress</h3>

          <ProgressBarAnimated
            value={overallProgress}
            colorFrom="green-400"
            colorTo="green-600"
            label="Health Progress"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
            <MetricCard
              title="Days Smoke-Free"
              value={daysSinceQuit || 0}
              color="bg-green-500"
              textColor="text-white"
            />

            <MetricCard
              title="Cigarettes Smoked"
              value={overall?.cigarettesLogged || 0}
              color="bg-amber-400"
              textColor="text-gray-900"
            />

            <MetricCard
              title="Money Saved"
              value={`₹${overall?.savings?.toFixed(0) || 0}`}
              color="bg-green-700"
              textColor="text-white"
            />

            <MetricCard
              title="Improvement"
              value={`${hybrid?.improvementSinceStart || 0}%`}
              color="bg-purple-500"
              textColor="text-white"
            />

            <MetricCard
              title="Today’s Cigarettes"
              value={todayCigs}
              color="bg-red-400"
              textColor="text-white"
            />
            <MetricCard title="Longest Streak" 
            value={`${longestStreak} days`} 
            color="bg-blue-500" 
            textColor="text-white" 
            />

            <MetricCard title="Current Streak" 
            value={`${currentStreak} days`} 
            color="bg-indigo-500" 
            textColor="text-white" 
            />
          </div>

          {/* ------------------ GOAL PROGRESS ------------------ */}
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Current Goal Progress</h3>

          <div className="bg-gradient-to-r from-amber-50 to-green-50 rounded-3xl p-6 shadow-xl mb-10 text-center">
            {goal ? (
              <>
                <h3 className="text-2xl font-bold mb-3 text-green-800">
                  {goal.title}
                </h3>

                <p className="text-gray-700 mb-1">
                  Target: <span className="font-semibold">{goal.targetCigarettes} / day</span>
                </p>

                <p className="text-gray-700 mb-1">
                  Ends On:{" "}
                  <span className="font-semibold">
                    {new Date(goal.targetDate).toLocaleDateString()}
                  </span>
                </p>

                <p className="text-gray-700 mb-4">
                  Days Left:{" "}
                  <span className="font-semibold">{goal.daysLeft}</span>
                </p>

                <ProgressBarAnimated
                  value={goal.goalProgress || 0}
                  colorFrom="green-400"
                  colorTo="green-600"
                />

                <Link
                  to="/goal"
                  className="inline-block mt-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-md transition"
                >
                  Edit Goal
                </Link>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-3">No active goal yet.</p>
                <ProgressBarAnimated value={0} colorFrom="green-400" colorTo="green-600" />

                <Link
                  to="/goal"
                  className="inline-block px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-md transition"
                >
                  Set Goal
                </Link>
              </>
            )}
          </div>

          {/* ------------------ GRAPH ------------------ */}
          <div className="bg-gray-50 rounded-2xl p-6 shadow-lg mb-10">
            <h3 className="text-gray-900 font-semibold mb-4">
              Smoking Pattern Over Time
            </h3>
            <Line data={chartData} options={{ plugins: { legend: { display: false } } }} />
          </div>

          {/* ------------------ MOTIVATION ------------------ */}
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-2xl px-6 py-4 text-gray-700 text-center italic">
            {suggestion || "Keep pushing forward — every smoke-free day counts!"}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

// Small Card
const MetricCard = ({ title, value, color, textColor }) => (
  <div
    className={`${color} ${textColor} rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform`}
  >
    <h3 className="font-semibold mb-2 opacity-90">{title}</h3>
    <p className="text-4xl font-bold">{value}</p>
  </div>
);

// Progress Bar
const ProgressBarAnimated = ({ value, colorFrom, colorTo, label }) => {
  const safeValue = Math.max(0, Math.min(100, Number(value))); // ensure number

  return (
    <div className="mb-6">
      {label && <p className="font-semibold text-gray-800 mb-2">{label}</p>}
      <div className="w-full bg-gray-200 h-6 rounded-full relative overflow-hidden mb-3">
        <motion.div
          className={`bg-gradient-to-r from-${colorFrom} to-${colorTo} h-6 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.span
          className="absolute top-0 left-3 text-sm font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {safeValue.toFixed(1)}% complete
        </motion.span>
      </div>
    </div>
  );
};


export default DashboardPage;
