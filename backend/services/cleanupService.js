import Roadmap from "../models/Roadmap.js";

/**
 * Elimina roadmaps temporales expirados
 * Se ejecuta automáticamente gracias al TTL index en MongoDB
 * O puede ejecutarse manualmente mediante esta función
 */
export const cleanupExpiredRoadmaps = async () => {
  try {
    const now = new Date();
    
    const result = await Roadmap.deleteMany({
      isSaved: false,
      expiresAt: { $lt: now }
    });

    console.log(`[CLEANUP] Se eliminaron ${result.deletedCount} roadmaps expirados`);
    
    return {
      success: true,
      deletedCount: result.deletedCount,
      timestamp: now
    };

  } catch (error) {
    console.error("[CLEANUP ERROR]", error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Inicia el cleanup automático (cada 24 horas)
 * Nota: MongoDB TTL también elimina automáticamente
 */
export const startCleanupScheduler = () => {
  console.log("✓ Cleanup scheduler iniciado (cada 24 horas)");
  
  // Ejecutar cada 24 horas
  setInterval(() => {
    cleanupExpiredRoadmaps();
  }, 24 * 60 * 60 * 1000);

  // Ejecutar en startup también
  cleanupExpiredRoadmaps();
};
