import Roadmap, { Counter } from "../models/Roadmap.js";
import User from "../models/User.js";
import { checkAchievements } from "../utils/gamification.js";
import { generateRoadmapAI } from "../services/aiService.js";

// Función auxiliar para generar el siguiente ID secuencial
const getNextRoadmapId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "roadmapCounter" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return String(counter.value).padStart(3, "0");
};

// Crear un nuevo roadmap - POST /
export const createRoadmap = async (req, res) => {
  try {
    const id = await getNextRoadmapId();
    const roadmap = await Roadmap.create({
      ...req.body,
      id,
      userId: req.user._id
    });

    // Actualizar estadísticas del usuario
    const user = await User.findById(req.user._id);
    user.stats.totalRoadmapsStarted += 1;

    // Revisar logro de crear primer roadmap
    const newAchievements = checkAchievements(user, user.stats);
    if (newAchievements.length > 0) {
      user.achievements.push(...newAchievements);
    }

    await user.save();

    res.status(201).json({
      message: "Roadmap creado exitosamente",
      roadmap,
      newAchievements: newAchievements.length > 0 ? newAchievements : null
    });
  } catch (error) {
    res.status(400).json({ message: "Error al crear roadmap", error: error.message });
  }
};

// Traer todos los roadmaps públicos - GET /
export const getPublicRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ isPublic: true }); 
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Traer todos los roadmaps del usuario autenticado - GET /me
export const getRoadmaps = async (req, res) => {
  try {
    console.log(">>> PETICION RECIBIDA EN /ME"); 
    console.log("Usuario detectado:", req.user); 
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }
    
    const roadmaps = await Roadmap.find({ userId: req.user._id });

    if (!roadmaps.length) {
      return res.status(404).json({ message: "No tienes roadmaps creados" });
    } 


    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Traer un roadmap por ID - GET /:id
export const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ id: req.params.id });

    if (!roadmap) return res.status(404).json({ message: "Roadmap No existe" });

    // Si es público, cualquier persona lo ve
    if (roadmap.isPublic) return res.json(roadmap);

    // Si es privado, necesita estar autenticado y ser el dueño
    if (!req.user) return res.status(401).json({ message: "No autorizado" });

    if (roadmap.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error de servidor" });
  }
};

// Generar roadmap con IA - POST /generate
export const generateWithAI = async (req, res) => {
  try {
    const { topic, level = "beginner", duration = "3 months" } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic es requerido" });
    }

    // Generar con IA
    const roadmapData = await generateRoadmapAI(topic, level, duration);

    // Crear roadmap en BD
    const id = await getNextRoadmapId();
    const roadmap = await Roadmap.create({
      id,
      userId: req.user._id,
      title: roadmapData.title,
      level: roadmapData.level,
      description: roadmapData.description,
      estimatedTime: roadmapData.estimatedTime,
      modules: roadmapData.modules,
      isPublic: false
    });

    // Actualizar stats
    const user = await User.findById(req.user._id);
    user.stats.totalRoadmapsStarted += 1;

    const newAchievements = checkAchievements(user, user.stats);
    if (newAchievements.length > 0) {
      user.achievements.push(...newAchievements);
    }

    await user.save();

    res.status(201).json({
      message: "Roadmap generado exitosamente con IA",
      roadmap,
      newAchievements: newAchievements.length > 0 ? newAchievements : null
    });
  } catch (error) {
    res.status(400).json({ 
      message: "Error al generar roadmap con IA", 
      error: error.message 
    });
  }
};

// Guardar/Favoritar un roadmap - PATCH /:id/save
export const saveRoadmap = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el roadmap
    const roadmap = await Roadmap.findById(id);

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap no encontrado" });
    }

    // Verificar que pertenece al usuario
    if (roadmap.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No tienes permiso para guardar este roadmap" });
    }

    // Marcar como guardado y actualizar expiración
    roadmap.isSaved = true;
    roadmap.expiresAt = null; // No expira si está guardado
    await roadmap.save();

    res.json({
      message: "Roadmap guardado exitosamente",
      roadmap
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Error al guardar roadmap", 
      error: error.message 
    });
  }
};

// Eliminar un roadmap - DELETE /:id
export const deleteRoadmap = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el roadmap
    const roadmap = await Roadmap.findById(id);

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap no encontrado" });
    }

    // Verificar que pertenece al usuario
    if (roadmap.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este roadmap" });
    }

    // Eliminar
    await Roadmap.findByIdAndDelete(id);

    res.json({
      message: "Roadmap eliminado exitosamente"
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Error al eliminar roadmap", 
      error: error.message 
    });
  }
};
