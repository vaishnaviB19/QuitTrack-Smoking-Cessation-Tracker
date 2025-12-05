import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import Logo from "../assets/logo.svg";
import { FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CigaretteLogs = () => {
  const [formData, setFormData] = useState({
    quantity: "",
    mood: "",
  });
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // ================================
  //  LOAD LOGS FROM BACKEND
  // ================================
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/logs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLogs(res.data.logs);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLogs();
  }, []);

  // ================================
  //  CHART DATA
  // ================================
  useEffect(() => {
    const grouped = logs.reduce((acc, log) => {
      const day = log.timestamp.slice(0, 10); // backend uses "timestamp"
      acc[day] = (acc[day] || 0) + Number(log.quantity);
      return acc;
    }, {});

    setChartData({
      labels: Object.keys(grouped),
      datasets: [
        {
          label: "Cigarettes Smoked",
          data: Object.values(grouped),
          backgroundColor: Object.values(grouped).map((val) =>
            val > 5 ? "#F44336" : val > 2 ? "#FFC107" : "#4CAF50"
          ),
          borderRadius: 8,
        },
      ],
    });
  }, [logs]);

  // ================================
  //  HANDLE INPUT
  // ================================
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));


  //  SUBMIT LOG TO BACKEND
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.quantity) return alert("Please enter quantity!");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/logs",
        {
          quantity: Number(formData.quantity),
          mood: formData.mood || "neutral",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLogs((prev) => [res.data.log, ...prev]);
      localStorage.setItem("dashboardRefresh", Date.now());
      navigate("/dashboard");
      setFormData({
        quantity: "",
        mood: "",
      });
    } catch (err) {
      console.log(err);
      alert("Failed to save log");
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Delete this log?")) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:5000/api/logs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Remove from local UI list
    setLogs((prev) => prev.filter((log) => log._id !== id));

    // 🔥 Notify dashboard to refresh stats
    window.dispatchEvent(new Event("storage"));

  } catch (error) {
    console.error("Delete Error:", error);
    alert("Failed to delete log. Please try again.");
  }
};


  return (
    <div className="pt-28 w-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-green-50/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-6 md:px-12 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="QuitTrack Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-3xl font-bold">
              <span className="text-green-500">Quit</span>
              <span className="text-amber-400">Track</span>
            </h1>
          </div>
          <FaUserCircle className="text-4xl text-green-700 cursor-pointer" />
        </div>
      </header>

      {/* Main */}
      <main className="w-full px-6 md:px-12 max-w-7xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center text-green-700">Cigarette Logs</h1>

        {/* Add Log Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4"
          whileHover={{ scale: 1.01 }}
        >
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter number of cigarettes"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Mood</label>
            <select
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select mood</option>
              <option value="stressed">Stressed</option>
              <option value="bored">Bored</option>
              <option value="happy">Happy</option>
              <option value="anxious">Anxious</option>
              <option value="neutral">Neutral</option>
              <option value="sad">Sad</option>
              <option value="tired">Tired</option>
            </select>
          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Add Log
          </button>
        </motion.form>

        {/* Log List */}
        <div className="bg-gray-100 p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-amber-500">Recent Logs</h2>

          {logs.length === 0 ? (
            <p className="text-gray-600">No logs yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-amber-400 text-gray-900">
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Quantity</th>
                    <th className="p-2 border">Mood</th>
                    <th className="p-2 border text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-amber-100">
                      <td className="p-2 border text-gray-900">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-2 border text-gray-900">{log.quantity}</td>
                      <td className="p-2 border text-gray-700 capitalize">{log.mood}</td>

                      <td className="p-2 border text-center space-x-3">
                        <button className="text-green-600 hover:text-green-700">
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(log._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Cigarettes Smoked (Per Day)</h2>
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      </main>
    </div>
  );
};

export default CigaretteLogs;
