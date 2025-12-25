// routes/healthRoutes.js
import express from "express";
import { getHealthProgress,getSavings } from "../controllers/health.controller.js";
import {verifyToken} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/progress", verifyToken, getHealthProgress);
router.get("/savings", verifyToken, getSavings);
export default router;
