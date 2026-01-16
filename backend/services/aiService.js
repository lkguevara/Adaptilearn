import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config.js";

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const generateRoadmapAI = async (prompt) => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const text = response.text;

    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    const cleanJson = text.replace(/```json|```/g, "").trim();
    const parsedJson = JSON.parse(cleanJson);
    return parsedJson;

  } catch (error) {
    throw error; 
  }
};
