import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'
import mongoose from "mongoose"
import { PORT } from './config.js'
import { startCleanupScheduler } from './services/cleanupService.js'

// routes
import { authRoutes, roadmapRoutes, progressRoutes, aiRoutes } from "./routes/index.js";


const app = express()

const ACCEPTED_ORIGINS = [
  "http://localhost:3000",
  "https://localhost:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    if (ACCEPTED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use(authRoutes);
app.use("/roadmaps", roadmapRoutes);
app.use("/progress", progressRoutes);
app.use(aiRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    startCleanupScheduler();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
