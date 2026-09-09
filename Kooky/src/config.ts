// Base URL of the backend API.
// In production this comes from the VITE_API_URL env var (set in Vercel's
// project settings). Locally it falls back to the backend dev server.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
