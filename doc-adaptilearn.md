# AdaptiLearn — Resumen para Reclutadores

**Última actualización:** 9 de febrero de 2026  
**Estado:** Activo (MVP)  

## Qué es
AdaptiLearn es una plataforma de aprendizaje que genera **roadmaps personalizados con IA** y permite **seguir el progreso** tema por tema. La idea central es convertir un objetivo de aprendizaje en un plan claro, medible y motivador.

## Qué problema resuelve
Muchas personas abandonan al aprender porque no tienen estructura, ni seguimiento real. AdaptiLearn crea una ruta clara, guarda el avance y agrega gamificación para mantener la constancia.

## Funcionalidades principales (MVP implementado)

### Backend (Node.js/Express)
- Registro, login y logout con JWT en cookie (`/register`, `/login`, `/logout`).
- Gestión de roadmaps: crear, listar públicos, listar del usuario (`/roadmaps`).
- Progreso por subtema con checkboxes persistidos en MongoDB (`/progress`).
- Estadísticas y achievements automáticos (`/progress/stats`, `/progress/achievements`).
- Generación de roadmaps con IA (Gemini) y validación estricta con Zod (`/generate-roadmap`).
- Roadmaps enriquecidos: **flashcards**, **proyectos por tema** y **proyecto final**, más recursos mixtos (lectura + video).
- Limpieza automática de roadmaps temporales (TTL + scheduler).

### Frontend (React)
- Home con hero y formulario base de búsqueda.
- Rutas públicas con layout general (`/` y `/login`).
- Base de estado de autenticación con Zustand.

## Funcionalidades objetivo (roadmap de producto)

### 3.1 Frontend (React)
| Funcionalidad | Descripción | Estado |
|---|---|---|
| Vista de Login/Registro | Iniciar sesión o crear cuenta | En progreso |
| Dashboard | Muestra 3 roadmaps fijos y formulario para generar roadmap personalizado | Planificado |
| Formulario de petición | Campo de texto para generar roadmap personalizado | Planificado |
| Visualización de Skill Tree (React Flow) | Grafo dirigido con nodos y conexiones | En desarrollo |
| Guía de estudio interactiva | Checklist por subtema con progreso en DB | Planificado |
| Guardado básico | Botón para guardar roadmap en MongoDB | Planificado |
| Tutor Contextual (Select to Explain) | UI basada en tema/texto seleccionado | En desarrollo |
| Ventana de conversación | Mensajes en sesión + persistencia para memoria | Planificado |
| Campo de entrada | Enviar nuevas preguntas al tutor | Planificado |
| Botón “Empezar Tema” | Activa el chat con contexto del tema | Planificado |
| Flashcards (repaso espaciado) | UI de tarjetas por subtema | Planificado |
| Recursos de video por búsqueda | Tarjetas desde términos de búsqueda (sin API) | En desarrollo |

### 3.2 Backend (Node.js/Express)
| Funcionalidad | Descripción | Estado |
|---|---|---|
| Endpoints de Auth | `/register` y `/login` con JWT | Implementado |
| Generación de roadmap | `/generate-roadmap` con Gemini + Zod | Implementado |
| Gestión de roadmaps | Crear/listar del usuario y públicos | Implementado |
| Progreso | Toggle de subtemas y stats | Implementado |
| Estructura avanzada de roadmap | Flashcards, proyectos y recursos mixtos | Implementado |
| Tutor IA contextual | `/tutor-chat` con contexto y memoria | En desarrollo |
| Memoria de conversación | Persistencia en MongoDB | En desarrollo |
| Repaso espaciado (SM-2) | Scheduling y estados por flashcard | Planificado |
| Anti-alucinación de recursos | Búsqueda real vía APIs externas | Planificado |
| Validación estricta con Zod | Schemas extendidos para skill tree, flashcards, proyectos y recursos | Implementado |

## Diferenciadores de Valor (Aprendizaje Activo)
- **Visualización de Skill Tree**: roadmaps representados como grafos dirigidos (nodos y conexiones) para evitar listas planas y mostrar dependencias reales.
- **Tutor Contextual (Select to Explain)**: soporte de IA proactivo según el tema o texto seleccionado, con respuestas contextualizadas (analogías, ejemplos, simplificación).
- **Sistema de Repaso Espaciado**: generación de flashcards por tema/subtema y reprogramación según desempeño (modelo tipo SM-2).
- **Anti‑Alucinación de Recursos**: la IA genera términos de búsqueda y el backend puede convertirlos en recursos reales (links de búsqueda hoy; APIs externas en roadmap).

En el backend, estos nuevos campos se validan de forma estricta con **Zod** antes de persistirlos para mantener un contrato de datos consistente.

## Stack tecnológico

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Zustand
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- Zod para validación
- Gemini API (`@google/genai`)

## Qué lo hace diferente
- **IA con validación estricta**: la respuesta del modelo se valida con Zod antes de guardar.
- **Gamificación real**: achievements automáticos según progreso.
- **Roadmaps temporales**: expiración automática y limpieza por TTL.
- **Aprendizaje activo**: skill tree + tutor contextual + repaso espaciado.
