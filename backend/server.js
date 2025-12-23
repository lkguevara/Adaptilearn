import express from 'express'
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import mongoose from "mongoose"
import { PORT } from './config.js'

// routes
import { authRoutes, roadmapRoutes, progressRoutes } from "./routes/index.js";


const app = express()

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
// Routes
app.use("/api", authRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/progress", progressRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
