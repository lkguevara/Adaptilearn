import express from "express";
import { toggleSubtopic, getProgressByTopic } from "../controllers/progressController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getProgressByTopic);
router.patch("/", protect, toggleSubtopic);

export default router;
