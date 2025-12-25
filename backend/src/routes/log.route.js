import express from "express";
import { createLog, getLogs, deleteLog} from "../controllers/log.controller.js";
import {verifyToken} from "../middleware/auth.middleware.js";
import { createLogValidation } from "../validations/log.validation.js";
import { validateRequest } from "../validations/validateRequest.js";

const router = express.Router();

router.use(verifyToken);
router.post("/", createLogValidation, validateRequest, createLog);
router.get("/",getLogs);   
router.delete("/:id", deleteLog);
export default router;
