import { GoogleGenAI } from "@google/genai";
import {
  GEMINI_API_KEY,
  GROQ_API_KEY,
  OPENROUTER_API_KEY,
} from "../config.js";

const genAI = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;
const GROQ_MODEL = "llama-3.3-70b-versatile";
const OPENROUTER_MODEL = "openrouter/free";

const extractJson = (text) => {
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("Invalid JSON response");
  }
};

const parseChatResponse = async (response, providerName) => {
  if (!response.ok) {
    const rawText = await response.text();
    let message = rawText;
    try {
      const parsed = JSON.parse(rawText);
      message = parsed?.error?.message || rawText;
    } catch {
      // keep rawText
    }
    throw new Error(`${providerName} error (${response.status}): ${message}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error(`Empty response from ${providerName}`);

  return extractJson(text);
};

const requestGroq = async (prompt) => {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY no está configurada");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.2,
      messages: [
        { role: "system", content: "Return ONLY valid JSON. No markdown." },
        { role: "user", content: prompt }
      ]
    })
  });

  return parseChatResponse(response, "Groq");
};

const requestOpenRouter = async (prompt) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY no está configurada");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      temperature: 0.2,
      messages: [
        { role: "system", content: "Return ONLY valid JSON. No markdown." },
        { role: "user", content: prompt }
      ]
    })
  });

  return parseChatResponse(response, "OpenRouter");
};


const requestGemini = async (prompt) => {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY no está configurada");
  }

  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const text = response.text;
  if (!text) {
    throw new Error("Empty response from Gemini API");
  }

  return extractJson(text);
};

export const generateRoadmapAI = async (prompt) => {
  const providers = [
    { name: "Gemini", enabled: Boolean(GEMINI_API_KEY), run: requestGemini },
    { name: "Groq", enabled: Boolean(GROQ_API_KEY), run: requestGroq },
    { name: "OpenRouter", enabled: Boolean(OPENROUTER_API_KEY), run: requestOpenRouter },
  ];

  let lastError = null;

  for (const provider of providers) {
    if (!provider.enabled) {
      console.warn(`[AI] ${provider.name} no configurado. Se omite.`);
      continue;
    }

    try {
      return await provider.run(prompt);
    } catch (error) {
      lastError = error;
      console.warn(`[AI] Falló ${provider.name}: ${error.message}`);
    }
  }

  throw lastError || new Error("No hay proveedores configurados");
};
