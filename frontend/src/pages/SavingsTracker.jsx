import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import Header from "../components/Header"; // adjust path

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const SavingsTracker = () => {
  const [pricePerCigarette, setPricePerCigarette] = useState(10);
  const [savingsGoal, setSavingsGoal] = useState(500);
  const [daysSmokeFree, setDaysSmokeFree] = useState(15);
  const [totalSaved, setTotalSaved] = useState(0);

  useEffect(() => {
    setTotalSaved(daysSmokeFree * pricePerCigarette);
  }, [pricePerCigarette, daysSmokeFree]);

  const progressPercent = Math.min((totalSaved / savingsGoal) * 100, 100);

  const lineChartData = {
    labels: Array.from({ length: daysSmokeFree }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: "Money Saved",
        data: Array.from({ length: daysSmokeFree }, (_, i) => (i + 1) * pricePerCigarette),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76,175,80,0.2)",
        pointBackgroundColor: "#FFC107",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div>
      <Header />
      <main className="pt-32 min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-green-500 mb-6">Savings Tracker</h1>

        {/* User Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Set Your Savings</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Price per Cigarette</label>
              <input
                type="number"
                value={pricePerCigarette}
                onChange={(e) => setPricePerCigarette(Number(e.target.value))}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-1">Savings Goal</label>
              <input
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(Number(e.target.value))}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6 flex-1 text-center">
            <h3 className="text-gray-900 font-semibold text-lg mb-2">Total Saved</h3>
            <p className="text-green-700 font-bold text-2xl">₹{totalSaved}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex-1 text-center">
            <h3 className="text-gray-900 font-semibold text-lg mb-2">Days Smoke-Free</h3>
            <p className="text-green-700 font-bold text-2xl">{daysSmokeFree}</p>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-gray-900 font-semibold text-lg mb-4">Savings Over Time</h3>
          <Line data={lineChartData} />
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-gray-900 font-semibold text-lg mb-2">Progress Toward Goal</h3>
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div
              className="h-6 rounded-full text-white font-semibold text-center"
              style={{ width: `${progressPercent}%`, background: "linear-gradient(to right, #4CAF50, #81C784)" }}
            >
              {progressPercent.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 font-semibold text-lg mb-3">Suggestions</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="text-amber-400 font-medium">Save for a new gadget!</li>
            <li className="text-green-500 font-medium">Plan a small trip with your savings.</li>
            <li className="text-amber-400 font-medium">Invest in a hobby you love.</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default SavingsTracker;
