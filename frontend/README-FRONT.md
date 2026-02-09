# AdaptiLearn - Frontend

Frontend en React + Vite con Tailwind CSS v4, React Router y Zustand.

## Requisitos
- Node.js

## Instalación y ejecución

```bash
cd frontend
npm install
npm run dev
```

## Scripts
- `npm run dev` - servidor de desarrollo
- `npm run build` - build de producción
- `npm run preview` - previsualización del build
- `npm run lint` - lint

## Configuración de API
El cliente usa Axios en `frontend/src/api/axios.js`:

- `baseURL`: `http://localhost:3000/api`
- `withCredentials: true`

Si el backend corre sin prefijo `/api`, actualiza el `baseURL` o ajusta el servidor para montar rutas bajo `/api`.

## Rutas de la app
- `/` → Home (Hero + Search)
- `/login` → Pantalla de login (placeholder)

## Estado y autenticación
- Store: `frontend/src/store/authStore.jsx`
- Endpoints usados: `GET /user` y `POST /logout`

La sesión depende de cookies (`withCredentials: true`).

## Estilos
- Tailwind CSS v4 (`@import "tailwindcss"`)
- Tema custom en `frontend/src/index.css`
- Fuentes Google en `frontend/index.html`

## Estructura rápida

```
frontend/
├── index.html
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── api/axios.js
│   ├── store/authStore.jsx
│   ├── routes/AppRouter.jsx
│   ├── pages/
│   └── components/
└── README.md
```
