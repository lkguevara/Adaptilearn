// validators/generateRoadmapSchema.js
// Schema Zod que valida el contrato EXACTO del Roadmap generado por IA

import { z } from 'zod';

// ========== SCHEMAS POR NIVEL ==========

const resourceSchema = z.object({
  name: z
    .string()
    .min(3, 'Nombre del recurso debe tener al menos 3 caracteres')
    .max(50, 'Nombre del recurso no puede exceder 50 caracteres'),
  
  url: z
    .string()
    .url('URL inválida')
    .startsWith('https://', 'URL debe ser HTTPS')
});

const subtopicSchema = z
  .string()
  .min(5, 'Subtema debe tener al menos 5 caracteres')
  .max(100, 'Subtema no puede exceder 100 caracteres');

const topicSchema = z.object({
  id: z
    .string()
    .regex(/^topic-\d+(-\d+)?$/, 'ID del tema debe seguir patrón topic-N o topic-N-M'),
  
  title: z
    .string()
    .min(3, 'Título del tema debe tener al menos 3 caracteres')
    .max(50, 'Título del tema no puede exceder 50 caracteres'),
  
  summary: z
    .string()
    .min(10, 'Resumen debe tener al menos 10 caracteres')
    .max(200, 'Resumen no puede exceder 200 caracteres'),
  
  estimatedTime: z
    .string()
    .regex(
      /^\d+\s*(hours?|days?|weeks?|months?|minutes?|horas?|días?|semanas?|meses?|minutos?)$/i,
      'Formato de tiempo inválido. Use: "X hours/days/weeks/months" o "X horas/días/semanas/meses"'
    ),
  
  subtopics: z
    .array(subtopicSchema)
    .min(3, 'Debe haber al menos 3 subtemas por tema')
    .max(8, 'Máximo 8 subtemas por tema'),
  
  resources: z
    .array(resourceSchema)
    .min(1, 'Debe haber al menos 1 recurso por tema')
    .max(5, 'Máximo 5 recursos por tema')
});

const moduleSchema = z.object({
  id: z
    .string()
    .regex(/^mod-\d+$/, 'ID del módulo debe seguir patrón mod-N (ej: mod-1)'),
  
  title: z
    .string()
    .min(3, 'Título del módulo debe tener al menos 3 caracteres')
    .max(50, 'Título del módulo no puede exceder 50 caracteres'),
  
  description: z
    .string()
    .min(10, 'Descripción del módulo debe tener al menos 10 caracteres')
    .max(200, 'Descripción del módulo no puede exceder 200 caracteres'),
  
  topics: z
    .array(topicSchema)
    .min(3, 'Debe haber al menos 3 temas por módulo')
    .max(8, 'Máximo 8 temas por módulo')
});

// ========== SCHEMA PRINCIPAL ==========

export const generateRoadmapSchema = z
  .object({
    title: z
      .string()
      .min(5, 'Título debe tener al menos 5 caracteres')
      .max(100, 'Título no puede exceder 100 caracteres'),
    
    description: z
      .string()
      .min(10, 'Descripción debe tener al menos 10 caracteres')
      .max(500, 'Descripción no puede exceder 500 caracteres'),
    
    level: z
      .enum(['beginner', 'intermediate', 'advanced'], {
        errorMap: () => ({ message: 'Level debe ser: beginner, intermediate, o advanced' })
      }),
    
    estimatedTime: z
      .string()
      .regex(
        /^\d+\s*(months?|weeks?|days?|hours?|meses?|semanas?|días?|horas?)$/i,
        'Formato de tiempo inválido. Use: "X months/weeks/days/hours" o "X meses/semanas/días/horas"'
      ),
    
    modules: z
      .array(moduleSchema)
      .min(3, 'Debe haber al menos 3 módulos')
      .max(10, 'Máximo 10 módulos por roadmap')
  })
  // Validaciones adicionales después de parsear
  .strict('No permitir campos extras en el JSON');

// ========== SCHEMA PARA PROMPT A IA ==========

/**
 * Schema para validar el input del usuario (prompt a la IA)
 */
export const generateRoadmapPromptSchema = z.object({
  topic: z
    .string()
    .min(3, 'Tema debe tener al menos 3 caracteres')
    .max(100, 'Tema no puede exceder 100 caracteres')
    .describe('El tema del roadmap que quieres generar (ej: "Data Science", "React", etc)'),
  
  level: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional()
    .default('beginner')
    .describe('Nivel de dificultad del roadmap'),
  
  duration: z
    .enum(['1_month', '2_months', '3_months', '4_months', '6_months'])
    .optional()
    .default('3_months')
    .describe('Duración estimada del roadmap')
});

// ========== SCHEMAS AUXILIARES ==========

/**
 * Schema para validar la respuesta completa de la API de generar roadmap
 */
export const generateRoadmapResponseSchema = z.object({
  message: z.string(),
  roadmap: generateRoadmapSchema,
  newAchievements: z.array(z.any()).optional()
});

// ========== FUNCIONES DE VALIDACIÓN ==========

/**
 * Valida que el JSON devuelto por la IA cumpla el contrato exacto
 * @param {unknown} data - El JSON a validar
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function validateAIGeneratedRoadmap(data) {
  try {
    const validated = generateRoadmapSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
        code: e.code
      }));
      return {
        success: false,
        error: 'El JSON generado por IA no cumple el contrato exacto',
        issues
      };
    }
    return {
      success: false,
      error: 'Error desconocido en validación'
    };
  }
}

/**
 * Valida el prompt del usuario antes de enviarlo a la IA
 * @param {unknown} data - El input del usuario
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function validateGenerateRoadmapPrompt(data) {
  try {
    const validated = generateRoadmapPromptSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }));
      return {
        success: false,
        error: 'Validación del prompt fallida',
        issues
      };
    }
    return {
      success: false,
      error: 'Error desconocido en validación'
    };
  }
}

/**
 * Verifica que los IDs sean únicos en el roadmap
 * @param {object} roadmap - El roadmap generado
 * @returns {boolean} true si todos los IDs son únicos
 */
export function validateUniqueIds(roadmap) {
  const moduleIds = new Set();
  const topicIds = new Set();

  for (const module of roadmap.modules) {
    // Validar module ID
    if (moduleIds.has(module.id)) {
      throw new Error(`ID de módulo duplicado: ${module.id}`);
    }
    moduleIds.add(module.id);

    // Validar topic IDs
    for (const topic of module.topics) {
      if (topicIds.has(topic.id)) {
        throw new Error(`ID de tema duplicado: ${topic.id}`);
      }
      topicIds.add(topic.id);
    }
  }

  return true;
}

/**
 * Valida el contrato COMPLETO del roadmap
 * (JSON + estructura + IDs únicos)
 */
export async function validateCompleteRoadmap(roadmap) {
  try {
    // Paso 1: Validar JSON contra schema Zod
    const validated = generateRoadmapSchema.parse(roadmap);

    // Paso 2: Validar IDs únicos
    validateUniqueIds(validated);

    return {
      success: true,
      data: validated,
      message: 'Roadmap validado correctamente contra el contrato'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.errors.map(e => ({
        field: e.path.join('.') || 'root',
        message: e.message,
        code: e.code
      }));
      
      return {
        success: false,
        error: 'Schema validation failed',
        issues: issues,
        message: `Validation error: ${issues.map(i => `${i.field}: ${i.message}`).join('; ')}`
      };
    }
    
    // Para otros tipos de errores (como de validateUniqueIds)
    return {
      success: false,
      error: error.message || 'Unknown validation error'
    };
  }
}
