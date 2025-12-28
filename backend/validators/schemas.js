import { z } from 'zod';

// ========== AUTH SCHEMAS ==========
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username debe tener al menos 3 caracteres')
    .max(30, 'Username no puede exceder 30 caracteres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username solo puede contener letras, números, guiones y guiones bajos'),
  email: z
    .string()
    .email('Email inválido')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Contraseña debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Contraseña debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Contraseña debe contener al menos un número')
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida')
});

// ========== ROADMAP SCHEMAS ==========
export const resourceSchema = z.object({
  name: z.string().min(1, 'Nombre del recurso requerido'),
  url: z.string().url('URL inválida')
});

export const topicSchema = z.object({
  id: z.string().min(1, 'ID del tema requerido'),
  title: z.string().min(3, 'Título del tema debe tener al menos 3 caracteres'),
  summary: z.string().optional(),
  estimatedTime: z.string().optional(),
  subtopics: z
    .array(z.string().min(1, 'Subtema no puede estar vacío'))
    .min(1, 'Debe haber al menos un subtema'),
  resources: z.array(resourceSchema).optional()
});

export const moduleSchema = z.object({
  id: z.string().min(1, 'ID del módulo requerido'),
  title: z.string().min(3, 'Título del módulo debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  topics: z
    .array(topicSchema)
    .min(1, 'Debe haber al menos un tema')
});

export const createRoadmapSchema = z.object({
  title: z
    .string()
    .min(5, 'Título debe tener al menos 5 caracteres')
    .max(100, 'Título no puede exceder 100 caracteres'),
  description: z.string().optional(),
  level: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .default('beginner'),
  isPublic: z.boolean().optional().default(false),
  estimatedTime: z.string().optional(),
  modules: z
    .array(moduleSchema)
    .min(1, 'Debe haber al menos un módulo'),
  connections: z.array(z.object({
    from: z.string(),
    to: z.string()
  })).optional()
});

// ========== PROGRESS SCHEMAS ==========
export const toggleSubtopicSchema = z.object({
  roadmapId: z.string().min(1, 'roadmapId es requerido'),
  topicId: z.string().min(1, 'topicId es requerido'),
  subtopicIndex: z
    .number()
    .int('El índice debe ser un número entero')
    .min(0, 'El índice no puede ser negativo'),
  isCompleted: z.boolean()
});

export const getProgressSchema = z.object({
  roadmapId: z.string().min(1, 'roadmapId es requerido'),
  topicId: z.string().min(1, 'topicId es requerido')
});

// ========== VALIDATION MIDDLEWARE ==========
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const data = schema.parse({
        ...req.body,
        ...req.params,
        ...req.query
      });
      
      // Reemplazar los datos con los validados (sanitizados)
      req.body = data;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json({
          message: 'Validación fallida',
          errors: formattedErrors
        });
      }
      res.status(400).json({ message: 'Error de validación' });
    }
  };
};
