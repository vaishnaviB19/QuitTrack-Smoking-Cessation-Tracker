import React from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { div } from "framer-motion/client";
import DashboardPage from "./pages/DashboardPage";
import CigaretteLogs from "./pages/cigaretteLogs";
import MoodTracker from "./pages/MoodTracker";
import HealthProgress from "./pages/HealthProgress";
import SavingsTracker from "./pages/SavingsTracker";
import GoalPage from "./pages/GoalPage";
import SetGoal from "./pages/SetGoal";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // ✅ Needed for X-axis
  LinearScale,   // ✅ Needed for Y-axis
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import ProtectedRoute from "./components/ProtectedRoute";

// Register the components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const App = () => {
      return(
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/logs" element={
            <ProtectedRoute>
               <CigaretteLogs />
            </ProtectedRoute>
          } />
          <Route path="/mood" element={
          <ProtectedRoute>
            <MoodTracker/> 
          </ProtectedRoute> } />
          <Route path="/health" element={
          <ProtectedRoute>
             <HealthProgress/>
          </ProtectedRoute>} />
          <Route path="/savings" element={
          <ProtectedRoute>
            <SavingsTracker />
          </ProtectedRoute>
            } />
            <Route path="/setgoal" element={
              <ProtectedRoute>
                <SetGoal />
              </ProtectedRoute>} />

            <Route path="/goal" element={
              <ProtectedRoute allowWithoutGoal={true}>
                <GoalPage />
              </ProtectedRoute>} />
              
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )
};

export default App;
