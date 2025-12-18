import express from "express";
import { 
  createRoadmap, 
  getPublicRoadmaps, 
  getRoadmaps, 
  getRoadmapById 
} from "../controllers/roadmapController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", getPublicRoadmaps);
router.get("/me", authMiddleware, getRoadmaps);
router.post("/", authMiddleware, createRoadmap);
router.get("/:id", getRoadmapById);


export default router;
