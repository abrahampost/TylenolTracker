import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Use /TylenolTracker/ for GitHub Pages production, / for local development
  const base = mode === 'production' ? '/TylenolTracker/' : '/'
  
  return {
    base,
    plugins: [react()],
    build: {
      outDir: 'dist',
    }
  }
})
