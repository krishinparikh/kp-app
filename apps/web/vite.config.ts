import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Mirrors the `@/*` paths entry in tsconfig.app.json.
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  // Read the repo root .env rather than a per-package one. Only VITE_-prefixed
  // vars are exposed to the client bundle.
  envDir: '../../',
  server: {
    port: 5173,
    // Listen on every interface so the port mapping reaches us in compose.
    host: process.env.VITE_IN_DOCKER ? true : undefined,
    // Bind-mounted source on macOS doesn't forward fs events into the
    // container, so fall back to polling when running under compose.
    watch: process.env.VITE_IN_DOCKER ? { usePolling: true } : undefined,
  },
})
