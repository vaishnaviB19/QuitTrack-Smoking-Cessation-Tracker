import express from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();
// This route matches your frontend URL: /api/dashboard/:userId
router.get("/", verifyToken, getDashboardData);

export default router;