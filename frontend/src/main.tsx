import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios'

// Set baseURL to the domain root so that paths like '/api/auth/login' resolve correctly.
// In dev, leave empty — Vite proxy handles '/api' => 'http://localhost:5000'.
// In production, VITE_API_BASE_URL should be 'https://zppsucares.site' (no trailing /api).
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
