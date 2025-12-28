# 📚 Documentación Técnica Completa - AdaptiLearn Backend

**Última actualización:** 28 de Diciembre de 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Producción

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Modelos de Datos](#modelos-de-datos)
6. [Nuevas Características (v1.0)](#nuevas-características-v10)
7. [Endpoints API](#endpoints-api)
8. [Flujos de Funcionamiento](#flujos-de-funcionamiento)
9. [Configuración e Instalación](#configuración-e-instalación)

---

## 📖 Descripción General

**AdaptiLearn** es una plataforma educativa de backend que permite:

- ✅ Gestión de usuarios con autenticación JWT
- ✅ Creación y gestión de roadmaps educativos personalizados
- ✅ Seguimiento detallado de progreso en temas y subtemas
- ✅ Sistema de roadmaps públicos y privados
- ✅ Cálculo automático de porcentajes de completitud
- ✅ **NUEVO:** Sistema de gamificación con badges/achievements
- ✅ **NUEVO:** Validación profunda de datos con Zod
- ✅ **NUEVO:** Estadísticas detalladas del usuario

### Objetivo Principal

Proporcionar una API RESTful robusta y segura que permita a los usuarios crear roadmaps de aprendizaje estructurados en módulos y temas, con seguimiento detallado del progreso, validación de datos y un sistema motivacional de gamificación.

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    Cliente Frontend                       │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────▼────────────────────────────────┐
│              Express Server (Puerto 3000)                │
├─────────────────────────────────────────────────────────┤
│                    Middleware Layer                       │
│  (CORS, JSON Parser, Cookie Parser, Auth, Validación)    │
├─────────────────────────────────────────────────────────┤
│                    Route Handlers                         │
│  (/auth, /roadmaps, /progress)                           │
├─────────────────────────────────────────────────────────┤
│                   Controllers Layer                       │
│  (Lógica de negocio + Gamificación)                      │
├─────────────────────────────────────────────────────────┤
│                    Models Layer                           │
│  (Schemas de MongoDB)                                    │
└────────────────────────┬────────────────────────────────┘
                         │ Driver
┌────────────────────────▼────────────────────────────────┐
│                   MongoDB Database                        │
│  (users, roadmaps, progress, counters)                   │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Node.js** | - | Runtime de JavaScript |
| **Express.js** | ^5.2.1 | Framework web |
| **MongoDB** | - | Base de datos NoSQL |
| **Mongoose** | ^9.0.1 | ODM para MongoDB |
| **JWT** | ^9.0.3 | Autenticación |
| **bcrypt** | ^6.0.0 | Hash de contraseñas |
| **Zod** | Latest | Validación de datos |
| **CORS** | ^2.8.5 | Control de acceso |
| **dotenv** | ^17.2.3 | Variables de entorno |
| **Cookie Parser** | ^1.4.7 | Parseo de cookies |

---

## 📁 Estructura del Proyecto

```
backend/
├── config.js                          # Configuración global
├── server.js                          # Punto de entrada
├── package.json                       # Dependencias y scripts
│
├── api/
│   └── generate-roadmap.json          # Ejemplo de estructura roadmap
│
├── controllers/                       # Lógica de negocio
│   ├── authController.js              # Autenticación + inicialización stats
│   ├── roadmapController.js           # Roadmaps + gamificación
│   └── progressController.js          # Progreso + achievements + stats
│
├── middleware/
│   └── authMiddleware.js              # Validación JWT
│
├── models/
│   ├── User.js                        # Usuario + achievements + stats
│   ├── Roadmap.js                     # Roadmap + módulos + temas
│   ├── Progress.js                    # Progreso por tema
│   └── Conversation.js                # Conversación (futuro)
│
├── routes/
│   ├── index.js                       # Exportación de rutas
│   ├── authRoutes.js                  # Auth + validación
│   ├── roadmapRoutes.js               # Roadmaps + validación
│   └── progressRoutes.js              # Progreso + validación
│
├── validators/
│   └── schemas.js                     # Esquemas Zod para validación
│
├── utils/
│   ├── generateToken.js               # Generador de JWT
│   └── gamification.js                # Lógica de badges y achievements
│
└── DOCUMENTACION_COMPLETA.md          # Este archivo
```

---

## 🗄️ Modelos de Datos

### 1. **User** (Usuario con Achievements y Stats)

```javascript
{
  _id: ObjectId,
  username: String,                     // Usuario único
  email: String,                        // Email único
  password: String,                     // Hasheado con bcrypt
  
  // 🎮 NUEVO: Achievements/Badges
  achievements: [{
    name: String,                       // 'first_topic_completed', etc
    unlockedAt: Date,
    description: String,
    icon: String                        // Emoji (🎯, 🏆, etc)
  }],
  
  // 📊 NUEVO: Estadísticas del Usuario
  stats: {
    totalTopicsCompleted: Number,       // Total temas completados
    totalRoadmapsStarted: Number,       // Roadmaps iniciados
    totalRoadmapsCompleted: Number,     // Roadmaps 100% completos
    totalStudyMinutes: Number,          // Minutos estudiados
    averageCompletionRate: Number,      // Porcentaje promedio
    lastActivityDate: Date,             // Última actividad
    longestStreak: Number,              // Racha más larga
    currentStreak: Number,              // Racha actual
    preferredTopics: [String],          // Temas favoritos
    learningVelocity: String            // 'slow', 'medium', 'fast'
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **Roadmap** (Plan de Aprendizaje)

```javascript
{
  _id: ObjectId,
  id: String,                           // ID secuencial (001, 002, etc)
  title: String,
  description: String,
  level: String,                        // 'beginner', 'intermediate', 'advanced'
  isPublic: Boolean,
  userId: ObjectId,                     // Referencia al creador
  estimatedTime: String,
  
  modules: [{
    id: String,
    title: String,
    description: String,
    topics: [{
      id: String,
      title: String,
      summary: String,
      estimatedTime: String,
      subtopics: [String],              // Array de strings
      resources: [{
        name: String,
        url: String                     // URL validada
      }]
    }]
  }],
  
  connections: [{
    from: String,                       // ID tema origen
    to: String                          // ID tema destino
  }],
  
  metadata: {
    source: String,
    dateGenerated: String
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **Progress** (Progreso del Usuario)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  roadmapId: String,                    // ID personalizado del roadmap
  topicId: String,
  
  subtopicProgress: [{
    subtopicContent: String,
    isCompleted: Boolean
  }],
  
  isTopicCompleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Índice único:** `{ userId, roadmapId, topicId }`

### 4. **Counter** (Generador de IDs)

```javascript
{
  _id: ObjectId,
  name: String,                         // "roadmapCounter"
  value: Number
}
```

---

## 🎮 Nuevas Características (v1.0)

### 1️⃣ Sistema de Validación Profundo (Zod)

Todos los datos se validan en el backend con **Zod**, proporcionando errores detallados:

**Auth:**
- ✅ Username: 3-30 caracteres, solo letras/números/guiones
- ✅ Email: Formato válido, convertido a lowercase
- ✅ Password: 8+ caracteres, 1 mayúscula, 1 minúscula, 1 número

**Roadmaps:**
- ✅ Título: 5-100 caracteres
- ✅ Nivel: Enum ['beginner', 'intermediate', 'advanced']
- ✅ Módulos: Al menos 1
- ✅ Temas: Al menos 1 subtema por tema
- ✅ Recursos: URLs válidas

**Progress:**
- ✅ roadmapId: String requerido
- ✅ topicId: String requerido
- ✅ subtopicIndex: Número entero >= 0

**Ejemplo de respuesta de error:**
```json
{
  "message": "Validación fallida",
  "errors": [
    {
      "field": "password",
      "message": "Contraseña debe contener al menos una mayúscula"
    }
  ]
}
```

---

### 2️⃣ Sistema de Gamificación (Badges)

**8 Badges Desbloqueables:**

| Badge | Nombre | Icono | Requisito |
|-------|--------|-------|-----------|
| Primer Paso | `first_topic_completed` | 🎯 | Completar 1 tema |
| Cuarto Camino | `roadmap_25_percent` | 📈 | 25% de un roadmap |
| Mitad del Camino | `roadmap_50_percent` | 🔥 | 50% completado |
| Casi Listo | `roadmap_75_percent` | 💪 | 75% completado |
| Campeón | `roadmap_completed` | 🏆 | 100% completado |
| Explorador | `five_roadmaps_started` | 🚀 | 5 roadmaps iniciados |
| Experto en Potencia | `ten_topics_completed` | ⭐ | 10 temas completados |
| Diseñador | `create_first_roadmap` | ✏️ | Crear 1 roadmap |

**¿Cuándo se desbloquean?**

Se desbloquean automáticamente en estos momentos:

1. Cuando completas tu primer tema → `first_topic_completed`
2. Cuando creas tu primer roadmap → `create_first_roadmap`
3. Cuando completas 10 temas en total → `ten_topics_completed`
4. Cuando comienzas 5 roadmaps → `five_roadmaps_started`
5. Cuando completas 25%, 50%, 75% y 100% de cualquier roadmap → `roadmap_XX_percent`

**Respuesta cuando se desbloquea un badge:**

```json
{
  "progress": { ... },
  "stats": { ... },
  "newAchievements": [
    {
      "name": "first_topic_completed",
      "description": "Completaste tu primer tema",
      "icon": "🎯",
      "unlockedAt": "2025-12-28T10:30:00Z"
    }
  ]
}
```

---

### 3️⃣ Sistema de Estadísticas

Cada usuario tiene un objeto `stats` que se actualiza automáticamente:

```javascript
stats: {
  totalTopicsCompleted: 15,             // Se incrementa al completar tema
  totalRoadmapsStarted: 3,              // Se incrementa al crear roadmap
  totalRoadmapsCompleted: 1,            // Se incrementa cuando roadmap = 100%
  totalStudyMinutes: 0,                 // Futuro
  averageCompletionRate: 0,             // Futuro
  lastActivityDate: Date,               // Se actualiza en cada acción
  longestStreak: 0,                     // Futuro
  currentStreak: 0,                     // Futuro
  preferredTopics: [],                  // Futuro
  learningVelocity: 'medium'            // Futuro
}
```

---

## 🔌 Endpoints API

### **Base URL:** `http://localhost:3000/api`

---

### 🔐 AUTENTICACIÓN

#### **Registrar Usuario** `POST /auth/register`

**Validación Zod aplicada**

**Request:**
```json
{
  "username": "juan_perez",
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Response (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "_id": "507f...",
    "username": "juan_perez",
    "email": "juan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errores:**
- `400` - Email ya registrado
- `400` - Validación fallida (ver detalles en respuesta)

---

#### **Login** `POST /auth/login`

**Validación Zod aplicada**

**Request:**
```json
{
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "message": "Login exitoso",
  "user": {
    "_id": "507f...",
    "username": "juan_perez",
    "email": "juan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errores:**
- `401` - Credenciales inválidas

---

### 📚 ROADMAPS

#### **Obtener Roadmaps Públicos** `GET /roadmaps`

**Response (200):**
```json
[
  {
    "id": "001",
    "title": "JavaScript Avanzado",
    "level": "advanced",
    "isPublic": true,
    "modules": [...]
  }
]
```

---

#### **Obtener Mis Roadmaps** `GET /roadmaps/me`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": "001",
    "title": "Mi Roadmap Personal",
    "isPublic": false,
    "modules": [...]
  }
]
```

---

#### **Obtener Roadmap por ID** `GET /roadmaps/:id`

**Parámetro:** `id` = ID del roadmap (ej: `009`)

**Response (200):**
```json
{
  "id": "009",
  "title": "React desde Cero",
  "level": "beginner",
  "modules": [ ... ]
}
```

**Acceso:**
- ✅ Público: Cualquiera
- ✅ Privado: Solo el dueño (requiere auth)

---

#### **Crear Roadmap** `POST /roadmaps`

**Headers:** `Authorization: Bearer <token>`  
**Validación Zod aplicada**

**Request:**
```json
{
  "title": "Python para Data Science",
  "level": "intermediate",
  "isPublic": false,
  "modules": [
    {
      "id": "mod-1",
      "title": "Fundamentos",
      "topics": [
        {
          "id": "topic-1",
          "title": "Variables y Tipos",
          "subtopics": ["Strings", "Números", "Listas"],
          "resources": [
            {
              "name": "Python Docs",
              "url": "https://docs.python.org"
            }
          ]
        }
      ]
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Roadmap creado exitosamente",
  "roadmap": {
    "id": "010",
    "title": "Python para Data Science",
    ...
  },
  "newAchievements": [
    {
      "name": "create_first_roadmap",
      "description": "Creaste tu primer roadmap personalizado",
      "icon": "✏️",
      "unlockedAt": "2025-12-28T10:30:00Z"
    }
  ]
}
```

---

### 📊 PROGRESO

#### **Obtener Progreso del Roadmap** `GET /api/progress/roadmap/:roadmapId`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "roadmapId": "009",
  "roadmapTitle": "React desde Cero",
  "summary": {
    "totalTopics": 15,
    "completedTopics": 5,
    "totalSubtopics": 45,
    "completedSubtopics": 15,
    "percentageCompleted": 33
  },
  "topicProgress": [
    {
      "topicId": "topic-1",
      "topicTitle": "Introducción",
      "moduleTitle": "Módulo 1",
      "totalSubtopics": 3,
      "completedSubtopics": 2,
      "percentageCompleted": 67,
      "isCompleted": false
    }
  ],
  "newAchievements": [
    {
      "name": "roadmap_25_percent",
      "description": "Completaste 25% de un roadmap",
      "icon": "📈",
      "unlockedAt": "2025-12-28T10:30:00Z"
    }
  ]
}
```

---

#### **Obtener Progreso por Tema** `GET /api/progress?roadmapId=009&topicId=topic-1`

**Headers:** `Authorization: Bearer <token>`  
**Query Parameters:**
- `roadmapId` (requerido)
- `topicId` (requerido)

**Response (200):**
```json
{
  "progress": {
    "userId": "507f...",
    "roadmapId": "009",
    "topicId": "topic-1",
    "subtopicProgress": [
      {
        "subtopicContent": "Sintaxis básica",
        "isCompleted": true
      }
    ],
    "isTopicCompleted": false
  },
  "stats": {
    "totalSubtopics": 2,
    "completedSubtopics": 1,
    "remainingSubtopics": 1,
    "percentageCompleted": 50,
    "isTopicCompleted": false
  }
}
```

---

#### **Marcar Subtema Completado** `PATCH /api/progress`

**Headers:** `Authorization: Bearer <token>`  
**Validación Zod aplicada**

**Request:**
```json
{
  "roadmapId": "009",
  "topicId": "topic-1",
  "subtopicIndex": 0,
  "isCompleted": true
}
```

**Response (200):**
```json
{
  "progress": { ... },
  "stats": {
    "totalSubtopics": 2,
    "completedSubtopics": 1,
    "isTopicCompleted": false
  },
  "newAchievements": [
    {
      "name": "first_topic_completed",
      "description": "Completaste tu primer tema",
      "icon": "🎯",
      "unlockedAt": "2025-12-28T10:30:00Z"
    }
  ]
}
```

---

### 📈 ESTADÍSTICAS (NUEVO)

#### **Obtener Estadísticas del Usuario** `GET /api/progress/stats`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "userId": "507f...",
  "username": "juan_perez",
  "stats": {
    "totalTopicsCompleted": 15,
    "totalRoadmapsStarted": 3,
    "totalRoadmapsCompleted": 1,
    "totalStudyMinutes": 0,
    "averageCompletionRate": 0,
    "lastActivityDate": "2025-12-28T10:45:00Z",
    "longestStreak": 0,
    "currentStreak": 0,
    "preferredTopics": [],
    "learningVelocity": "medium"
  },
  "achievements": [
    {
      "name": "first_topic_completed",
      "description": "Completaste tu primer tema",
      "icon": "🎯",
      "unlockedAt": "2025-12-28T10:30:00Z"
    }
  ],
  "totalAchievements": 1,
  "roadmapStats": {
    "001": {
      "topicsStarted": 5,
      "topicsCompleted": 3
    }
  }
}
```

---

#### **Obtener Logros del Usuario** `GET /api/progress/achievements`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "userId": "507f...",
  "achievements": [
    {
      "name": "first_topic_completed",
      "description": "Completaste tu primer tema",
      "icon": "🎯",
      "unlockedAt": "2025-12-28T10:30:00Z"
    }
  ],
  "totalUnlocked": 1,
  "availableBadges": [
    {
      "name": "first_topic_completed",
      "title": "🎯 Primer Paso",
      "description": "Completaste tu primer tema",
      "unlocked": true,
      "requirement": "Completar 1 tema"
    },
    {
      "name": "roadmap_25_percent",
      "title": "📈 Cuarto Camino",
      "description": "Completaste 25% de un roadmap",
      "unlocked": false,
      "requirement": "25% de un roadmap"
    }
    // ... más badges
  ]
}
```

---

## 🔄 Flujos de Funcionamiento

### **Flujo 1: Registro de Usuario**

```
POST /auth/register
    ↓
1. Validar con Zod (username, email, password)
2. Verificar email único
3. Hashear password con bcrypt
4. Crear User con stats iniciales
    {
      stats: {
        totalTopicsCompleted: 0,
        totalRoadmapsStarted: 0,
        ...
      },
      achievements: []
    }
    ↓
5. Retornar usuario + token JWT
```

---

### **Flujo 2: Crear Roadmap**

```
POST /roadmaps (autenticado)
    ↓
1. Validar con Zod (title, modules, topics, etc)
2. Generar siguiente ID secuencial
3. Crear Roadmap con userId
4. Incrementar user.stats.totalRoadmapsStarted
5. Revisar badges (create_first_roadmap)
    ↓
6. Retornar roadmap + newAchievements (si hay)
```

---

### **Flujo 3: Marcar Subtema Completado**

```
PATCH /progress (autenticado)
    ↓
1. Validar con Zod (roadmapId, topicId, subtopicIndex)
2. Obtener Roadmap y validar existencia
3. Buscar/crear Progress
4. Actualizar subtopicProgress
5. Calcular si isTopicCompleted = true
6. Si se completó el tema:
   - Incrementar user.stats.totalTopicsCompleted
   - Revisar badges (first_topic_completed, ten_topics_completed)
7. Revisar badges por porcentaje (25%, 50%, 75%, 100%)
    ↓
8. Retornar progress + stats + newAchievements (si hay)
```

---

### **Flujo 4: Obtener Estadísticas**

```
GET /progress/stats (autenticado)
    ↓
1. Obtener usuario
2. Obtener todos Progress del usuario
3. Calcular roadmaps únicos donde tiene progreso
4. Contar roadmaps completados (100%)
5. Retornar stats + achievements + roadmapStats
```

---

## 🛡️ Seguridad y Validación

### **Validación en Frontend y Backend**
- Todos los inputs se validan con **Zod**
- Mensajes de error detallados y específicos
- Sanitización de emails (lowercase automático)
- URLs validadas en recursos

### **Autenticación**
- JWT en Authorization header
- Tokens con expiración (7 días)
- Middleware de autenticación en rutas protegidas

### **Almacenamiento de Contraseñas**
- Hash con **bcrypt** (10 rounds)
- Nunca se retornan en respuestas
- Comparación segura en login

### **Control de Acceso**
- Roadmaps privados: Solo dueño
- Roadmaps públicos: Acceso libre
- Progreso: Solo del usuario autenticado

---

## 🔧 Configuración e Instalación

### **Requisitos**
- Node.js >= 16.0.0
- MongoDB (local o Atlas)
- npm o yarn

### **Variables de Entorno (.env)**
```env
MONGO_URI=mongodb://localhost:27017/adaptilearn
JWT_SECRET=tu_secreto_super_seguro_aqui
PORT=3000
NODE_ENV=development
```

### **Instalación**
```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo (con hot-reload)
npm run dev

# Iniciar en producción
npm start
```

### **Scripts**
```bash
npm run dev      # Desarrollo con hot-reload
npm start        # Producción
```

---

## 📁 Archivos Nuevos/Modificados (v1.0)

### **Creados:**
- `validators/schemas.js` - Esquemas Zod completos
- `utils/gamification.js` - Lógica de badges y achievements

### **Modificados:**
- `models/User.js` - Agregado achievements y stats
- `controllers/authController.js` - Validación + init stats
- `controllers/roadmapController.js` - Validación + gamificación
- `controllers/progressController.js` - Validación + gamificación + nuevos endpoints
- `routes/authRoutes.js` - Middleware de validación
- `routes/roadmapRoutes.js` - Middleware de validación
- `routes/progressRoutes.js` - Middleware de validación + nuevas rutas

---

## 🧪 Ejemplos de Uso

### **Test 1: Registrar Usuario**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan_perez",
    "email": "juan@gmail.com",
    "password": "Password123"
  }'
```

### **Test 2: Login y Obtener Token**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@gmail.com",
    "password": "Password123"
  }'
```

### **Test 3: Obtener Estadísticas**
```bash
curl http://localhost:3000/api/progress/stats \
  -H "Authorization: Bearer <token_obtenido>"
```

### **Test 4: Desbloquear Primer Badge**
```bash
# 1. Crear un roadmap
# 2. Marcar un tema como completo
curl -X PATCH http://localhost:3000/api/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "roadmapId": "001",
    "topicId": "topic-1",
    "subtopicIndex": 0,
    "isCompleted": true
  }'
# ✅ Respuesta incluirá newAchievements
```

---

## 🚀 Roadmap Futuro

- [ ] Calcular totalStudyMinutes basado en sesiones
- [ ] Sistema de racha (streak) diario automático
- [ ] Detectar temas preferidos automáticamente
- [ ] Notificaciones cuando se desbloquean badges
- [ ] Leaderboard de usuarios
- [ ] Comparar estadísticas con otros usuarios
- [ ] Tests automáticos (Jest + Supertest)
- [ ] Swagger/OpenAPI documentation
- [ ] Rate limiting y throttling
- [ ] Logs estructurados (Winston/Pino)
- [ ] Implementar modelo Conversation (chat IA)

---

## 📊 Resumen de Características

| Característica | Estado | Versión |
|---|---|---|
| Autenticación JWT | ✅ | 1.0 |
| Roadmaps CRUD | ✅ | 1.0 |
| Progreso y Temas | ✅ | 1.0 |
| Validación Zod | ✅ | 1.0 |
| Gamificación (8 Badges) | ✅ | 1.0 |
| Estadísticas Usuario | ✅ | 1.0 |
| Endpoints de Stats | ✅ | 1.0 |
| Endpoints de Achievements | ✅ | 1.0 |

---

## 📞 Soporte y Contacto

Para reportar bugs, sugerencias o mejoras, contacta al equipo de desarrollo.

**Última actualización:** 28 de Diciembre de 2025  
**Mantenedor:** Equipo AdaptiLearn
