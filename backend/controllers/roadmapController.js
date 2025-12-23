import Roadmap, { Counter } from "../models/Roadmap.js";

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
    res.status(201).json(roadmap);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    const roadmap = await Roadmap.findById(req.params.id);

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
