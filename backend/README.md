# AdaptiLearn - Backend Simple

## Qué Hace Este Proyecto

Un backend educativo donde:
- Usuarios se registran y logean
- Crean roadmaps (cursos) con temas y subtemas
- Marcan progreso (qué completaron)
- Desbloquean badges automáticamente
- Ven sus estadísticas

## Comenzar

```bash
cd backend

# 1. Instalar dependencias
npm install

# 2. Crear .env con:
GEMINI_API_KEY=tu_api_key_aqui

# 3. Correr
npm start
```

Corre en `localhost:3000`

**Nota:** Consigue API key gratis en https://ai.google.dev

## 27 Endpoints (Todos Listos)

**Auth:**
- POST `/api/auth/register` - Registrarse
- POST `/api/auth/login` - Logearse
- POST `/api/auth/logout` - Deslogearse

**Roadmaps:**
- GET `/api/roadmaps` - Roadmaps públicos
- GET `/api/roadmaps/me` - Mis roadmaps
- GET `/api/roadmaps/:id` - Detalle roadmap
- POST `/api/roadmaps` - Crear roadmap

**Progreso:**
- GET `/api/progress` - Mi progreso
- GET `/api/progress/:roadmapId` - Progreso en roadmap
- PATCH `/api/progress` - Marcar como completado
- GET `/api/progress/stats` - Mis estadísticas
- GET `/api/progress/achievements` - Mis badges

(+ 15 más para gestión interna)

## Base de Datos

MongoDB con estos modelos:
- **User** - Usuarios con achievements y stats
- **Roadmap** - Cursos con módulos, temas, subtemas
- **Progress** - Qué completó cada usuario
- **Counter** - Para IDs secuenciales

## Cómo Funciona (Flujo Simple)

```
1. Usuario se registra → Se crea User con stats=0
2. Usuario crea roadmap → Se asigna ID automático
3. Usuario marca tema completo → 
   - Se actualiza Progress
   - Se calculan stats
   - Se chequean badges (¿desbloqueó algo?)
4. Usuario ve /stats → Ve sus números y badges
```

## Validación de Datos

Todo input se valida con **Zod**:
- Registro: email válido, password 8+ caracteres
- Roadmap: título 5-100 chars, mínimo 3 módulos
- Progreso: IDs válidos, formato correcto

## 8 Badges (Se Desbloquean Automáticamente)

- 🎯 Primer tema completado
- 📈 25% de roadmap
- 🔥 50% de roadmap
- 💪 75% de roadmap
- 🏆 100% de roadmap completo
- 🚀 5 roadmaps iniciados
- ⭐ 10 temas completados
- ✏️ Crear primer roadmap

## Próximo: Generar Roadmaps con IA (IMPLEMENTADO ✅)

Usuario escribe un tema → IA genera el roadmap automáticamente:

```bash
curl -X POST http://localhost:3000/api/roadmaps/generate \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Data Science",
    "level": "intermediate",
    "duration": "3 months"
  }'
```

Respuesta:
```json
{
  "message": "Roadmap generado exitosamente con IA",
  "roadmap": {
    "id": "002",
    "title": "Data Science",
    "modules": [...],
    "createdAt": "2025-12-28"
  }
}
```

**Cómo funciona:**
1. Envías `{topic, level, duration}`
2. IA genera JSON automáticamente
3. Se guarda en BD como roadmap normal
4. Se actualizan stats y badges

## Estructura de Carpetas

```
backend/
├── server.js           # App Express
├── config.js           # Conexión DB
├── package.json
├── controllers/        # Lógica de negocio
├── models/            # Esquemas MongoDB
├── routes/            # Endpoints
├── middleware/        # Auth, validación
├── validators/        # Zod schemas
└── utils/             # Helpers
```

## Testing Quick

```bash
# Registrarse
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"juan","email":"juan@test.com","password":"Passwor123"}'

# Crear roadmap
curl -X POST http://localhost:3000/api/roadmaps \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Avanzado",
    "level": "intermediate",
    "modules": [...]
  }'
```

## ¿Preguntas?

El código es simple. Si no entiendes algo:
- Mira `controllers/` para ver qué hace cada endpoint
- Mira `models/` para ver la estructura de datos
- Mira `validators/schemas.js` para ver qué se valida
