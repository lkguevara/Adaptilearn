import express from "express";
import { register, login, logout, getUserData } from "../controllers/authController.js";
import { validateRequest, registerSchema, loginSchema } from "../validators/schemas.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
router.get("/user", authMiddleware, getUserData);


export default router;
