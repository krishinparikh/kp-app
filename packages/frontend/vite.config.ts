import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Read the repo root .env rather than a per-package one. Only VITE_-prefixed
  // vars are exposed to the client bundle.
  envDir: '../../',
  server: {
    port: 5173,
    // Bind-mounted source on macOS doesn't forward fs events into the
    // container, so fall back to polling when running under compose.
    watch: process.env.VITE_IN_DOCKER ? { usePolling: true } : undefined,
  },
})
