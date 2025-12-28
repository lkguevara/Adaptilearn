import express from "express";
import { toggleSubtopic, getProgressByTopic, getRoadmapProgress, getUserStats, getUserAchievements } from "../controllers/progressController.js";
import protect from "../middleware/authMiddleware.js";
import { validateRequest, toggleSubtopicSchema, getProgressSchema } from "../validators/schemas.js";

const router = express.Router();

router.get("/", protect, validateRequest(getProgressSchema), getProgressByTopic);
router.get("/stats", protect, getUserStats);
router.get("/achievements", protect, getUserAchievements);
router.get("/roadmap/:roadmapId", protect, getRoadmapProgress);
router.patch("/", protect, validateRequest(toggleSubtopicSchema), toggleSubtopic);

export default router;
