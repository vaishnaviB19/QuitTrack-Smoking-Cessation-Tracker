import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import goalRoutes from "./routes/goal.route.js";
import logRoutes from "./routes/log.route.js";
import healthRoutes from "./routes/health.route.js";
import userRoutes from "./routes/user.routes.js";
import User from "./models/user.model.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/health", healthRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.send("Server is running");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));