import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { FaSmile, FaMeh, FaFrown, FaTired, FaGrin } from "react-icons/fa";
import Header from "../components/Header"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Updated mood colors to fit theme
const moodOptions = [
  { label: "Happy", icon: <FaSmile />, color: "amber-400" },
  { label: "Stressed", icon: <FaFrown />, color: "red-500" },
  { label: "Anxious", icon: <FaTired />, color: "amber-600" },
  { label: "Bored", icon: <FaMeh />, color: "gray-600" },
  { label: "Neutral", icon: <FaGrin />, color: "green-500" },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [moodHistory, setMoodHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMood) return alert("Please select a mood!");
    const newEntry = { mood: selectedMood, note, date: new Date(date) };
    setMoodHistory([newEntry, ...moodHistory]);
    setSelectedMood(null);
    setNote("");
    setDate(new Date().toISOString().slice(0, 16));
  };

  // Bar chart data
  const moodCounts = moodOptions.map(
    (m) => moodHistory.filter((entry) => entry.mood.label === m.label).length
  );

  const barData = {
    labels: moodOptions.map((m) => m.label),
    datasets: [
      {
        label: "Mood Frequency",
        data: moodCounts,
        backgroundColor: moodOptions.map((m) => {
          const colors = {
            "amber-400": "255, 193, 7",
            "amber-600": "255, 160, 0",
            "red-500": "244, 67, 54",
            "gray-600": "117, 117, 117",
            "green-500": "76, 175, 80",
          };
          return `rgba(${colors[m.color]}, 0.7)`;
        }),
      },
    ],
  };

  // Calendar tile color
  const getTileContent = ({ date, view }) => {
    if (view === "month") {
      const moodsOfDay = moodHistory.filter(
        (entry) =>
          entry.date.getFullYear() === date.getFullYear() &&
          entry.date.getMonth() === date.getMonth() &&
          entry.date.getDate() === date.getDate()
      );
      if (moodsOfDay.length > 0) {
        const mostRecentMood = moodsOfDay[0].mood;
        return (
          <div
            className={`w-4 h-4 rounded-full mx-auto mt-1 bg-${mostRecentMood.color}`}
          ></div>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <Header/>
    <div className="bg-gray-100 min-h-screen p-6 py-28 space-y-8">
      {/* Mood Entry Form */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Log Your Mood</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            {moodOptions.map((m) => (
              <button
                key={m.label}
                type="button"
                onClick={() => setSelectedMood(m)}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 
                  ${selectedMood?.label === m.label ? `border-green-500 scale-110` : "border-gray-300"} 
                  transition-transform duration-200 hover:scale-105`}
              >
                <span className={`text-2xl text-${m.color}`}>{m.icon}</span>
                <span className="text-sm mt-1 text-gray-900">{m.label}</span>
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">Notes (optional)</label>
            <textarea
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What triggered this mood?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">Date & Time</label>
            <input
              type="datetime-local"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Calendar Heatmap */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-green-500">Calendar Heatmap</h2>
        <Calendar
          tileContent={getTileContent}
          className="border rounded-md"
        />
      </div>

      {/* Mood History Timeline */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-green-500">Mood History</h2>
        {moodHistory.length === 0 ? (
          <p className="text-gray-600">No moods logged yet.</p>
        ) : (
          <ul className="space-y-3">
            {moodHistory.map((entry, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between border-b border-gray-200 pb-2"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-2xl text-${entry.mood.color}`}>
                    {entry.mood.icon}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{entry.mood.label}</p>
                    {entry.note && <p className="text-gray-600 text-sm">{entry.note}</p>}
                    <p className="text-gray-500 text-xs">{entry.date.toLocaleString()}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Insights Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-green-500">Insights</h2>
        <Bar data={barData} />
        <p className="text-gray-600 mt-2">
          Frequency of each mood logged. Future: correlation with cigarette logs and coping suggestions.
        </p>
      </div>
    </div>
    </div>
  );
};

export default MoodTracker;
