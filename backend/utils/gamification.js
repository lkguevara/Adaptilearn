// utils/gamification.js - Lógica de badges y achievements

const ACHIEVEMENTS = {
  first_topic_completed: {
    name: 'first_topic_completed',
    title: '🎯 Primer Paso',
    description: 'Completaste tu primer tema',
    icon: '🎯',
    requirement: 'Completar 1 tema'
  },
  roadmap_25_percent: {
    name: 'roadmap_25_percent',
    title: '📈 Cuarto Camino',
    description: 'Completaste 25% de un roadmap',
    icon: '📈',
    requirement: '25% de un roadmap'
  },
  roadmap_50_percent: {
    name: 'roadmap_50_percent',
    title: '🔥 Mitad del Camino',
    description: 'Completaste 50% de un roadmap',
    icon: '🔥',
    requirement: '50% de un roadmap'
  },
  roadmap_75_percent: {
    name: 'roadmap_75_percent',
    title: '💪 Casi Listo',
    description: 'Completaste 75% de un roadmap',
    icon: '💪',
    requirement: '75% de un roadmap'
  },
  roadmap_completed: {
    name: 'roadmap_completed',
    title: '🏆 Campéon',
    description: 'Completaste un roadmap completo',
    icon: '🏆',
    requirement: 'Completar 100% de un roadmap'
  },
  five_roadmaps_started: {
    name: 'five_roadmaps_started',
    title: '🚀 Explorador',
    description: 'Comenzaste 5 roadmaps diferentes',
    icon: '🚀',
    requirement: 'Comenzar 5 roadmaps'
  },
  ten_topics_completed: {
    name: 'ten_topics_completed',
    title: '⭐ Experto en Potencia',
    description: 'Completaste 10 temas en total',
    icon: '⭐',
    requirement: 'Completar 10 temas'
  },
  create_first_roadmap: {
    name: 'create_first_roadmap',
    title: '✏️ Diseñador',
    description: 'Creaste tu primer roadmap personalizado',
    icon: '✏️',
    requirement: 'Crear 1 roadmap'
  }
};

/**
 * Verifica qué badges debería desbloquear el usuario basado en su progreso
 * @param {Object} user - Documento del usuario
 * @param {Object} stats - Estadísticas del usuario
 * @returns {Array} Array de nuevos badges desbloqueados
 */
export const checkAchievements = (user, stats) => {
  const newAchievements = [];
  const unlockedNames = new Set(user.achievements.map(a => a.name));

  // Badge: Primer tema completado
  if (stats.totalTopicsCompleted >= 1 && !unlockedNames.has('first_topic_completed')) {
    newAchievements.push({
      name: 'first_topic_completed',
      description: ACHIEVEMENTS.first_topic_completed.description,
      icon: ACHIEVEMENTS.first_topic_completed.icon,
      unlockedAt: new Date()
    });
  }

  // Badge: 10 temas completados
  if (stats.totalTopicsCompleted >= 10 && !unlockedNames.has('ten_topics_completed')) {
    newAchievements.push({
      name: 'ten_topics_completed',
      description: ACHIEVEMENTS.ten_topics_completed.description,
      icon: ACHIEVEMENTS.ten_topics_completed.icon,
      unlockedAt: new Date()
    });
  }

  // Badge: 5 roadmaps comenzados
  if (stats.totalRoadmapsStarted >= 5 && !unlockedNames.has('five_roadmaps_started')) {
    newAchievements.push({
      name: 'five_roadmaps_started',
      description: ACHIEVEMENTS.five_roadmaps_started.description,
      icon: ACHIEVEMENTS.five_roadmaps_started.icon,
      unlockedAt: new Date()
    });
  }

  // Badge: Crear primer roadmap
  if (stats.totalRoadmapsStarted >= 1 && !unlockedNames.has('create_first_roadmap')) {
    newAchievements.push({
      name: 'create_first_roadmap',
      description: ACHIEVEMENTS.create_first_roadmap.description,
      icon: ACHIEVEMENTS.create_first_roadmap.icon,
      unlockedAt: new Date()
    });
  }

  return newAchievements;
};

/**
 * Calcula logros por porcentaje de completitud de un roadmap
 * @param {number} percentageCompleted - Porcentaje (0-100)
 * @param {Object} user - Documento del usuario
 * @returns {Array} Array de nuevos badges por porcentaje
 */
export const checkPercentageAchievements = (percentageCompleted, user) => {
  const newAchievements = [];
  const unlockedNames = new Set(user.achievements.map(a => a.name));

  const milestones = [
    { percentage: 25, achievement: 'roadmap_25_percent' },
    { percentage: 50, achievement: 'roadmap_50_percent' },
    { percentage: 75, achievement: 'roadmap_75_percent' },
    { percentage: 100, achievement: 'roadmap_completed' }
  ];

  milestones.forEach(milestone => {
    if (percentageCompleted >= milestone.percentage && 
        !unlockedNames.has(milestone.achievement)) {
      const achievementData = ACHIEVEMENTS[milestone.achievement];
      newAchievements.push({
        name: milestone.achievement,
        description: achievementData.description,
        icon: achievementData.icon,
        unlockedAt: new Date()
      });
    }
  });

  return newAchievements;
};

/**
 * Obtiene información detallada de todos los achievements
 */
export const getAllAchievements = () => {
  return Object.values(ACHIEVEMENTS);
};

/**
 * Obtiene información detallada de un achievement específico
 */
export const getAchievementDetails = (name) => {
  return ACHIEVEMENTS[name] || null;
};

/**
 * Calcula la velocidad de aprendizaje basado en estadísticas
 * @param {Object} stats - Estadísticas del usuario
 * @returns {string} 'slow', 'medium' o 'fast'
 */
export const calculateLearningVelocity = (stats) => {
  if (stats.totalTopicsCompleted === 0) return 'medium';
  
  const topicsPerDay = stats.totalTopicsCompleted / 
    Math.max(1, Math.floor((Date.now() - stats.createdAt) / (1000 * 60 * 60 * 24)));
  
  if (topicsPerDay > 0.5) return 'fast';
  if (topicsPerDay > 0.2) return 'medium';
  return 'slow';
};
