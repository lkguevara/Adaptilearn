import express from "express";
import { 
  createRoadmap, 
  getPublicRoadmaps, 
  getRoadmaps, 
  getRoadmapById 
} from "../controllers/roadmapController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateRequest, createRoadmapSchema } from "../validators/schemas.js";

const router = express.Router();

router.get("/", getPublicRoadmaps);
router.get("/me", authMiddleware, getRoadmaps);
router.post("/", authMiddleware, validateRequest(createRoadmapSchema), createRoadmap);
router.get("/:id", getRoadmapById);


export default router;
