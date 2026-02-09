# AdaptiLearn - Backend

API REST con Express + MongoDB para autenticación, roadmaps, progreso y generación de roadmaps con IA.

## Requisitos
- Node.js
- MongoDB

## Configuración
Crea un archivo `.env` en `backend/`:

```bash
MONGO_URI=mongodb://localhost:27017/adaptilearn
JWT_SECRET=tu_secreto_jwt
GEMINI_API_KEY=tu_api_key_gemini
PORT=3000
NODE_ENV=development
```

Notas:
- `PORT` y `NODE_ENV` son opcionales.
- El backend requiere `MONGO_URI` y `JWT_SECRET` para funcionar.

## Instalación y ejecución

```bash
cd backend
npm install
npm run dev   # modo watch
# o
npm start
```

Base URL: `http://localhost:3000` (no hay prefijo `/api`).

## Autenticación
- `POST /login` devuelve un `token` y setea la cookie `token` (httpOnly).
- El middleware lee **solo** la cookie `token` (no usa header `Authorization`).
- Para clientes web, usa `withCredentials: true`.

Ejemplo rápido con `curl` (cookies):

```bash
# Login y guardar cookie
curl -c cookies.txt -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"Password123"}'

# Llamar un endpoint protegido
curl -b cookies.txt http://localhost:3000/roadmaps/me
```

## Endpoints

### Auth
- `POST /register`
- `POST /login`
- `POST /logout`
- `GET /user` (protegido)

### Roadmaps
- `GET /roadmaps` (públicos)
- `GET /roadmaps/me` (protegido)
- `GET /roadmaps/:id` (público si `isPublic`, privado para el dueño)
- `POST /roadmaps` (protegido, validado con Zod)
- `POST /roadmaps/generate` (protegido, generación IA básica)
- `PATCH /roadmaps/:id/save` (protegido)
- `DELETE /roadmaps/:id` (protegido)

### IA
- `POST /generate-roadmap` (protegido, IA + validación estricta con Zod)

### Progreso
- `GET /progress?roadmapId=...&topicId=...` (protegido)
- `GET /progress/roadmap/:roadmapId` (protegido)
- `PATCH /progress` (protegido, toggle de subtema)
- `GET /progress/stats` (protegido)
- `GET /progress/achievements` (protegido)

## Notas importantes
- `GET /roadmaps/:id` busca por el campo secuencial `id` (ej: `"001"`).
- `PATCH /roadmaps/:id/save` y `DELETE /roadmaps/:id` usan el **_id de MongoDB**.
- El modelo `Roadmap` incluye expiración (`expiresAt`) y `isSaved`. Los roadmaps no guardados se eliminan automáticamente (TTL + cleanup).
- El endpoint `/generate-roadmap` limita a 5 roadmaps no guardados por usuario.
- El frontend actual usa `http://localhost:3000/api` en `frontend/src/api/axios.js`; ajusta la base URL o monta un prefijo `/api` en el servidor si lo necesitas.

## Estructura rápida

```
backend/
├── server.js
├── config.js
├── routes/
├── controllers/
├── models/
├── middleware/
├── validators/
├── services/
└── utils/
```
