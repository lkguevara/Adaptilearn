// controllers/progressController.js
import Progress from '../models/Progress.js';
import Roadmap from '../models/Roadmap.js';
import User from '../models/User.js';
import { checkAchievements, checkPercentageAchievements } from '../utils/gamification.js';

export const toggleSubtopic = async (req, res) => {
    try {
        const { roadmapId, topicId, subtopicIndex, isCompleted } = req.body;
        const userId = req.user._id;

        // 1. Validar si el Roadmap existe
        const roadmap = await Roadmap.findOne({ id: roadmapId });
        
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
        let wasTopicCompleted = progress ? progress.isTopicCompleted : false;

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

        // 6. Actualizar estadísticas del usuario
        const user = await User.findById(userId);
        
        // Si el tema se acaba de completar
        if (!wasTopicCompleted && progress.isTopicCompleted) {
            user.stats.totalTopicsCompleted += 1;
        }

        // Revisar y desbloquear logros
        const newAchievements = checkAchievements(user, user.stats);
        if (newAchievements.length > 0) {
            user.achievements.push(...newAchievements);
        }

        await user.save();
        
        // Retornar respuesta con información completa
        res.status(200).json({
            progress,
            stats: {
                totalSubtopics,
                completedSubtopics,
                remainingSubtopics,
                isTopicCompleted: progress.isTopicCompleted
            },
            newAchievements: newAchievements.length > 0 ? newAchievements : null
        });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar progreso", error: error.message });
    }
};

// Obtener progreso por topic
export const getProgressByTopic = async (req, res) => {
    try {
        const { roadmapId, topicId } = req.query;
        const userId = req.user._id;

        if (!roadmapId || !topicId) {
            return res.status(400).json({ message: "roadmapId y topicId son requeridos." });
        }

        // 1. Obtener el roadmap para conocer los subtopics totales
        const roadmap = await Roadmap.findOne({ id: roadmapId });
        
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
        const percentageCompleted = totalSubtopics === 0 ? 0 : (completedSubtopics / totalSubtopics) * 100;

        res.status(200).json({
            progress: progress || null,
            stats: {
                totalSubtopics,
                completedSubtopics,
                remainingSubtopics,
                percentageCompleted,
                isTopicCompleted: progress ? progress.isTopicCompleted : false,
                subtopics: topicData.subtopics
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener progreso", error: error.message });
    }
};

// Obtener progreso general del roadmap
export const getRoadmapProgress = async (req, res) => {
    try {
        const { roadmapId } = req.params;
        const userId = req.user._id;

        if (!roadmapId) {
            return res.status(400).json({ message: "roadmapId es requerido." });
        }

        // 1. Obtener el roadmap para conocer todos los topics
        const roadmap = await Roadmap.findOne({ id: roadmapId });
        
        if (!roadmap) {
            return res.status(404).json({ message: "Roadmap no encontrado." });
        }

        // 2. Extraer todos los topics del roadmap
        const allTopics = [];
        roadmap.modules.forEach(module => {
            module.topics.forEach(topic => {
                allTopics.push({
                    id: topic.id,
                    title: topic.title,
                    moduleId: module.id,
                    moduleTitle: module.title
                });
            });
        });

        // 3. Obtener el progreso del usuario para este roadmap
        const allProgress = await Progress.find({ userId, roadmapId });

        // 4. Crear un mapa de progreso por topicId
        const progressMap = {};
        allProgress.forEach(p => {
            progressMap[p.topicId] = p;
        });

        // 5. Calcular estadísticas por topic
        const topicStats = allTopics.map(topic => {
            const progress = progressMap[topic.id];
            const totalSubtopics = roadmap.modules
                .flatMap(m => m.topics)
                .find(t => t.id === topic.id)?.subtopics.length || 0;
            
            const completedSubtopics = progress 
                ? progress.subtopicProgress.filter(s => s.isCompleted).length 
                : 0;
            
            const percentageCompleted = totalSubtopics === 0 
                ? 0 
                : (completedSubtopics / totalSubtopics) * 100;

            return {
                topicId: topic.id,
                topicTitle: topic.title,
                moduleTitle: topic.moduleTitle,
                totalSubtopics,
                completedSubtopics,
                percentageCompleted: Math.round(percentageCompleted),
                isCompleted: progress ? progress.isTopicCompleted : false
            };
        });

        // 6. Calcular totales del roadmap
        const totalTopics = allTopics.length;
        const completedTopics = topicStats.filter(t => t.isCompleted).length;
        const totalSubtopics = topicStats.reduce((acc, t) => acc + t.totalSubtopics, 0);
        const completedSubtopics = topicStats.reduce((acc, t) => acc + t.completedSubtopics, 0);
        const roadmapPercentage = totalTopics === 0 
            ? 0 
            : Math.round((completedTopics / totalTopics) * 100);

        // 7. Revisar logros por porcentaje de completitud
        const user = await User.findById(userId);
        const newPercentageAchievements = checkPercentageAchievements(roadmapPercentage, user);
        if (newPercentageAchievements.length > 0) {
            user.achievements.push(...newPercentageAchievements);
            await user.save();
        }

        res.status(200).json({
            roadmapId,
            roadmapTitle: roadmap.title,
            summary: {
                totalTopics,
                completedTopics,
                totalSubtopics,
                completedSubtopics,
                percentageCompleted: roadmapPercentage
            },
            topicProgress: topicStats,
            newAchievements: newPercentageAchievements.length > 0 ? newPercentageAchievements : null
        });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener progreso del roadmap", error: error.message });
    }
};

// Obtener estadísticas del usuario - GET /progress/stats
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Obtener todos los progesos del usuario para calcular estadísticas
        const allProgress = await Progress.find({ userId });
        
        // Calcular temas completados por roadmap
        const roadmapStats = {};
        allProgress.forEach(p => {
            if (!roadmapStats[p.roadmapId]) {
                roadmapStats[p.roadmapId] = {
                    topicsStarted: 0,
                    topicsCompleted: 0
                };
            }
            roadmapStats[p.roadmapId].topicsStarted += 1;
            if (p.isTopicCompleted) {
                roadmapStats[p.roadmapId].topicsCompleted += 1;
            }
        });

        // Contar roadmaps únicos donde el usuario tiene progreso
        const roadsStarted = Object.keys(roadmapStats).length;
        const roadsCompleted = Object.values(roadmapStats).filter(r => r.topicsStarted === r.topicsCompleted).length;

        // Actualizar stats del usuario
        user.stats.totalRoadmapsStarted = Math.max(user.stats.totalRoadmapsStarted, roadsStarted);
        user.stats.totalRoadmapsCompleted = roadsCompleted;
        user.stats.lastActivityDate = new Date();

        res.status(200).json({
            userId: user._id,
            username: user.username,
            stats: user.stats,
            achievements: user.achievements,
            totalAchievements: user.achievements.length,
            roadmapStats
        });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener estadísticas", error: error.message });
    }
};

// Obtener logros/achievements del usuario - GET /progress/achievements
export const getUserAchievements = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({
            userId: user._id,
            achievements: user.achievements,
            totalUnlocked: user.achievements.length,
            availableBadges: [
                {
                    name: 'first_topic_completed',
                    title: '🎯 Primer Paso',
                    description: 'Completaste tu primer tema',
                    unlocked: user.achievements.some(a => a.name === 'first_topic_completed'),
                    requirement: 'Completar 1 tema'
                },
                {
                    name: 'roadmap_25_percent',
                    title: '📈 Cuarto Camino',
                    description: 'Completaste 25% de un roadmap',
                    unlocked: user.achievements.some(a => a.name === 'roadmap_25_percent'),
                    requirement: '25% de un roadmap'
                },
                {
                    name: 'roadmap_50_percent',
                    title: '🔥 Mitad del Camino',
                    description: 'Completaste 50% de un roadmap',
                    unlocked: user.achievements.some(a => a.name === 'roadmap_50_percent'),
                    requirement: '50% de un roadmap'
                },
                {
                    name: 'roadmap_75_percent',
                    title: '💪 Casi Listo',
                    description: 'Completaste 75% de un roadmap',
                    unlocked: user.achievements.some(a => a.name === 'roadmap_75_percent'),
                    requirement: '75% de un roadmap'
                },
                {
                    name: 'roadmap_completed',
                    title: '🏆 Campeón',
                    description: 'Completaste un roadmap completo',
                    unlocked: user.achievements.some(a => a.name === 'roadmap_completed'),
                    requirement: 'Completar 100% de un roadmap'
                },
                {
                    name: 'five_roadmaps_started',
                    title: '🚀 Explorador',
                    description: 'Comenzaste 5 roadmaps diferentes',
                    unlocked: user.achievements.some(a => a.name === 'five_roadmaps_started'),
                    requirement: 'Comenzar 5 roadmaps'
                },
                {
                    name: 'ten_topics_completed',
                    title: '⭐ Experto en Potencia',
                    description: 'Completaste 10 temas en total',
                    unlocked: user.achievements.some(a => a.name === 'ten_topics_completed'),
                    requirement: 'Completar 10 temas'
                },
                {
                    name: 'create_first_roadmap',
                    title: '✏️ Diseñador',
                    description: 'Creaste tu primer roadmap personalizado',
                    unlocked: user.achievements.some(a => a.name === 'create_first_roadmap'),
                    requirement: 'Crear 1 roadmap'
                }
            ]
        });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener logros", error: error.message });
    }
};