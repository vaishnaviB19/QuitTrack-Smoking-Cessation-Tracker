import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getGoal, saveGoal } from "../controllers/goal.controller.js";

const router = express.Router();

router.get("/", verifyToken, getGoal);
router.post("/", verifyToken, saveGoal);

export default router;
