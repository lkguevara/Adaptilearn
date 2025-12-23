// controllers/progressController.js
import Progress from '../models/Progress.js';
import Roadmap from '../models/Roadmap.js';

// controllers/progressController.js

export const toggleSubtopic = async (req, res) => {
    try {
        const { roadmapId, topicId, subtopicIndex, isCompleted } = req.body;
        const userId = req.user._id;

        // 1. Validar si el Roadmap existe
        const roadmap = await Roadmap.findById(roadmapId);
        
        if (!roadmap) {
            return res.status(404).json({ message: "Roadmap no encontrado. Verifica el ID." });
        }

        // 2. Buscar el topic dentro de los modules
        let topicData = null;
        for (const module of roadmap.modules) {
            const topic = module.topics.find(t => t.id === topicId);
            if (topic) {
                topicData = topic;
                break;
            }
        }

        if (!topicData) {
            return res.status(404).json({ message: "Topic no encontrado." });
        }

        // 3. Obtener el contenido del subtopic usando el índice
        const subtopicContent = topicData.subtopics[subtopicIndex];
        
        if (!subtopicContent) {
            return res.status(400).json({ message: "Subtopic no válido." });
        }

        // 4. Buscar o crear el progreso
        let progress = await Progress.findOne({ userId, roadmapId, topicId });

        if (!progress) {
            progress = new Progress({
                userId,
                roadmapId,
                topicId,
                subtopicProgress: [{ subtopicContent, isCompleted }]
            });
        } else {
            const subtopicProgressIndex = progress.subtopicProgress.findIndex(
                (s) => s.subtopicContent === subtopicContent
            );

            if (subtopicProgressIndex !== -1) {
                progress.subtopicProgress[subtopicProgressIndex].isCompleted = isCompleted;
            } else {
                progress.subtopicProgress.push({ subtopicContent, isCompleted });
            }
        }

        // 5. Calcular estado del tema
        const totalSubtopics = topicData.subtopics.length;
        const completedSubtopics = progress.subtopicProgress.filter(s => s.isCompleted).length;
        const remainingSubtopics = totalSubtopics - completedSubtopics;
        
        progress.isTopicCompleted = completedSubtopics === totalSubtopics;

        await progress.save();
        
        // Retornar respuesta con información completa
        res.status(200).json({
            progress,
            stats: {
                totalSubtopics,
                completedSubtopics,
                remainingSubtopics,
                isTopicCompleted: progress.isTopicCompleted
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar progreso", error: error.message });
    }
};

export const getProgressByTopic = async (req, res) => {
    try {
        const { roadmapId, topicId } = req.query;
        const userId = req.user._id;

        if (!roadmapId || !topicId) {
            return res.status(400).json({ message: "roadmapId y topicId son requeridos." });
        }

        // 1. Obtener el roadmap para conocer los subtopics totales
        const roadmap = await Roadmap.findById(roadmapId);
        
        if (!roadmap) {
            return res.status(404).json({ message: "Roadmap no encontrado." });
        }

        // 2. Buscar el topic dentro de los modules
        let topicData = null;
        for (const module of roadmap.modules) {
            const topic = module.topics.find(t => t.id === topicId);
            if (topic) {
                topicData = topic;
                break;
            }
        }

        if (!topicData) {
            return res.status(404).json({ message: "Topic no encontrado." });
        }

        // 3. Obtener el progreso
        const progress = await Progress.findOne({ userId, roadmapId, topicId });

        // 4. Calcular estadísticas
        const totalSubtopics = topicData.subtopics.length;
        const completedSubtopics = progress ? progress.subtopicProgress.filter(s => s.isCompleted).length : 0;
        const remainingSubtopics = totalSubtopics - completedSubtopics;

        res.status(200).json({
            progress: progress || null,
            stats: {
                totalSubtopics,
                completedSubtopics,
                remainingSubtopics,
                isTopicCompleted: progress ? progress.isTopicCompleted : false,
                subtopics: topicData.subtopics
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener progreso", error: error.message });
    }
};