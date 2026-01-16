import Roadmap, { Counter } from "../models/Roadmap.js";
import { generateRoadmapAI } from "../services/aiService.js";
import { validateCompleteRoadmap } from "../validators/generateRoadmapSchema.js";
import { buildRoadmapPrompt } from "../utils/promptBuilder.js";

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

    // 3. Validar con Zod
    const validationResult = await validateCompleteRoadmap(aiResponse);

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
