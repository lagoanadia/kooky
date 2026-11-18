# 🍳 Kooky

A recipe finder: type the ingredients you have and get recipes that use them, plus **AI-generated cooking tips** for each one. React + TypeScript frontend, Express backend that talks to **Spoonacular** and **Groq**.

## 📁 Project Structure

```
├── Kooky/                         → Frontend (React + TypeScript + Vite, installable PWA)
│   ├── src/
│   │   ├── App.tsx                → Search state, calls the backend, shows results or errors
│   │   ├── config.ts              → API_BASE_URL (VITE_API_URL in production)
│   │   └── components/
│   │       ├── SearchCard.tsx     → Ingredient input + search button
│   │       ├── SearchBar.tsx      → The input itself
│   │       ├── SuggestionPills.tsx→ Quick ideas: "Pasta Night", "Leftover Chicken"…
│   │       ├── RecipeList.tsx     → List of results
│   │       ├── RecipeCard.tsx     → One recipe + its AI tips
│   │       ├── Plate.tsx, Logo.tsx, SocialLinks.tsx → Visual pieces
│   └── public/                    → manifest.webmanifest + sw.js (PWA)
└── backend/
    └── server.js                  → Express API: /recipes and /ai
```

## 🚀 How It Works

1. You type ingredients (or tap a suggestion pill) and search
2. The frontend calls `GET /recipes?ingredients=...` on the backend
3. The backend asks Spoonacular's `findByIngredients` for 5 recipes and returns them
4. For a recipe, the frontend calls `POST /ai`; the backend asks a Groq model, prompted as *a professional chef*, for 3 concise cooking tips

### API keys stay on the server

Spoonacular and Groq keys live in the backend's `.env`; the browser only talks to your own API.

### Protecting a public API

Because the endpoints need no login, the backend:

- **Rate-limits** each IP to 30 requests every 15 minutes (`express-rate-limit`) so a bot can't burn the daily quota
- **Restricts CORS** to the deployed frontend (`FRONTEND_URL`) and the Vite dev server

```js
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 })
app.get('/recipes', apiLimiter, async (req, res) => { ... })
```

### Clear UI states

`App.tsx` tracks `isSearching` and `searchError`: empty input, server errors and network failures each get a friendly message, and `finally` always clears the loading state.

## 🧠 Key Concepts

- **Frontend / backend split** — React SPA + Express REST API
- **Third-party APIs** — Spoonacular (recipes) and Groq (LLM)
- **Secrets management** — `.env` + `dotenv`, `VITE_API_URL`
- **API protection** — rate limiting and a CORS allow-list
- **Lifting state / props** — passing setters to child components
- **PWA** — web manifest + service worker

## 🛠️ How To Run

Backend — create `backend/.env` with `GROQ_API_KEY` and `SPOONACULAR_API_KEY`, then:

```bash
cd backend
npm install
node server.js
```

Frontend (in another terminal):

```bash
cd Kooky
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend uses `http://localhost:3000` as the API by default.
