import { div } from "framer-motion/client";
import React from "react";
import { FaHeart, FaLungs, FaClock, FaStar } from "react-icons/fa";
import Header from "../components/Header";

const milestones = [
  { time: "20 mins", icon: <FaHeart className="text-green-500 w-6 h-6" />, desc: "Heart rate & blood pressure start returning to normal" },
  { time: "8 hours", icon: <FaClock className="text-amber-400 w-6 h-6" />, desc: "Carbon monoxide levels drop" },
  { time: "1 day", icon: <FaStar className="text-green-700 w-6 h-6" />, desc: "Risk of heart attack decreases" },
  { time: "1 week", icon: <FaLungs className="text-green-500 w-6 h-6" />, desc: "Nicotine leaves the body" },
  { time: "1 month", icon: <FaLungs className="text-green-700 w-6 h-6" />, desc: "Lung function improves" },
  { time: "1 year", icon: <FaHeart className="text-green-500 w-6 h-6" />, desc: "Risk of heart disease decreases significantly" },
];

const metrics = [
  { label: "Heart Rate Improvement", value: 75, gradient: "bg-gradient-to-r from-green-500 to-green-300" },
  { label: "Lung Capacity", value: 60, gradient: "bg-gradient-to-r from-green-500 to-green-300" },
  { label: "Oxygen Levels", value: 85, gradient: "bg-gradient-to-r from-green-500 to-green-300" },
];

const tips = [
  "Your blood pressure is normalizing",
  "Keep going! You've made it 1 week smoke-free",
  "Lung function is improving, keep up the good work!",
];

const HealthProgress = () => {
  return (
    <div>
        <Header/>
    <div className="p-6 py-28 space-y-12 bg-gray-100 min-h-screen">

      {/* Milestones Timeline */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-green-700">Health Milestones</h2>
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {milestones.map((m, idx) => (
            <div key={idx} className="flex items-start md:flex-col md:items-center bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-center space-x-2 mb-2 md:mb-4">{m.icon}<span className="font-semibold text-gray-900">{m.time}</span></div>
              <p className="text-gray-600 text-sm text-center md:text-center">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Health Metrics */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-green-500">Health Metrics</h2>
        <div className="space-y-4">
          {metrics.map((metric, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-900">{metric.label}</span>
                <span className="font-medium text-gray-900">{metric.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className={`${metric.gradient} h-4 rounded-full`} style={{ width: `${metric.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips & Info */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-green-500">Tips & Info</h2>
        <div className="space-y-3">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-amber-100 border-l-4 border-amber-400 p-4 rounded shadow-sm hover:shadow-md transition">
              <p className="text-gray-900">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default HealthProgress;
