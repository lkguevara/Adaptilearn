import express from "express";
import { generateRoadmap } from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-roadmap", protect, generateRoadmap);

export default router;
