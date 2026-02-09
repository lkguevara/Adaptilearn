import dotenv from "dotenv";
dotenv.config();

export const {
    PORT = 3000,
    GEMINI_API_KEY,
    GROQ_API_KEY,
    OPENROUTER_API_KEY,
} = process.env
