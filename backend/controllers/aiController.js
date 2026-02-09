import Roadmap, { Counter } from "../models/Roadmap.js";
import { generateRoadmapAI } from "../services/aiService.js";
import { validateCompleteRoadmap } from "../validators/generateRoadmapSchema.js";
import { buildRoadmapPrompt } from "../utils/promptBuilder.js";

const isYouTubeUrl = (url = "") =>
  url.includes("youtube.com/") || url.includes("youtu.be/");

const isYouTubeSearchUrl = (url = "") =>
  url.includes("youtube.com/results?search_query=");

const isYouTubeWatchUrl = (url = "") =>
  url.includes("youtube.com/watch") || url.includes("youtu.be/");

const buildYouTubeSearchUrl = (query) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

const pickVideoQuery = (topic, fallback) => {
  if (Array.isArray(topic?.search_queries) && topic.search_queries.length > 0) {
    return topic.search_queries[0];
  }
  if (topic?.title) {
    return `${topic.title} tutorial`;
  }
  return fallback || "tutorial";
};

const normalizeRoadmapResources = (roadmap) => {
  if (!roadmap?.modules) return roadmap;

  roadmap.modules.forEach((module) => {
    module?.topics?.forEach((topic) => {
      if (!Array.isArray(topic.resources)) {
        topic.resources = [];
      }

      topic.resources = topic.resources.map((resource) => {
        if (!resource) return resource;

        const type = resource.type || (isYouTubeUrl(resource.url) ? "video" : "article");
        let url = resource.url;

        // Si es video y trae link directo, lo convertimos a búsqueda para evitar links dudosos.
        if (type === "video" && !isYouTubeSearchUrl(url)) {
          const query = pickVideoQuery(topic, resource.name);
          url = buildYouTubeSearchUrl(query);
        }

        return { ...resource, type, url };
      });

      const hasVideo = topic.resources.some((r) => r?.type === "video");
      const queries = Array.isArray(topic.search_queries)
        ? topic.search_queries
        : [];

      if (!hasVideo && queries.length > 0) {
        for (const q of queries) {
          if (topic.resources.length >= 5) break;
          topic.resources.push({
            type: "video",
            name: `YouTube: ${q}`,
            url: buildYouTubeSearchUrl(q)
          });
        }
      }

      // Si aún no hay video, agrega uno básico basado en el título
      if (!topic.resources.some((r) => r?.type === "video")) {
        const q = pickVideoQuery(topic, "tutorial");
        topic.resources.push({
          type: "video",
          name: `YouTube: ${q}`,
          url: buildYouTubeSearchUrl(q)
        });
      }
    });
  });

  return roadmap;
};

// Función auxiliar para generar el siguiente ID secuencial
const getNextRoadmapId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "roadmapCounter" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return String(counter.value).padStart(3, "0");
};

export const generateRoadmap = async (req, res) => {
  try {
    const { topic, level } = req.body;

    if (!topic || !level) {
      return res.status(400).json({ message: "topic y level son requeridos" });
    }

    // Verificar límite de roadmaps sin guardar (máx 5)
    const unsavedRoadmaps = await Roadmap.countDocuments({
      userId: req.user._id,
      isSaved: false
    });

    if (unsavedRoadmaps >= 5) {
      return res.status(400).json({
        message: "Límite de roadmaps alcanzado",
        error: "Tienes 5 roadmaps temporales. Guarda o elimina algunos antes de generar más.",
        unsavedCount: unsavedRoadmaps
      });
    }

    // 1. Construir prompt
    const prompt = buildRoadmapPrompt(topic, level);

    // 2. Llamar a la IA
    const aiResponse = await generateRoadmapAI(prompt);
    const normalizedResponse = normalizeRoadmapResources(aiResponse);

    // 3. Validar con Zod
    const validationResult = await validateCompleteRoadmap(normalizedResponse);

    if (!validationResult.success) {
      return res.status(422).json({
        message: "La IA devolvió un roadmap inválido",
        error: validationResult.message || validationResult.error,
        issues: validationResult.issues
      });
    }

    const validatedRoadmap = validationResult.data;

    // 4. Generar ID secuencial
    const id = await getNextRoadmapId();

    // 5. Calcular fecha de expiración (7 días)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // 6. Guardar roadmap
    const roadmap = await Roadmap.create({
      ...validatedRoadmap,
      id,
      userId: req.user._id,
      isPublic: false,
      isSaved: false,
      expiresAt: expiresAt,
      metadata: {
        source: "GEMINI_AI",
        dateGenerated: new Date().toISOString()
      }
    });

    res.status(201).json({
      message: "Roadmap generado exitosamente",
      warning: "Este roadmap se eliminará en 7 días si no lo guardas",
      expiresAt: expiresAt,
      roadmap: roadmap
    });

  } catch (error) {
    res.status(500).json({
      message: "Error generando roadmap",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
