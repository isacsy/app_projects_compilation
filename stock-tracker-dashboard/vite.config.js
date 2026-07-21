import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Forwards /api/* to `vercel dev` (run alongside `npm run dev`) so the
      // frontend can call the same relative paths in local dev and on Vercel.
      '/api': 'http://localhost:3000',
    },
  },
})
