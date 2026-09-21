import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// This package ships source, not a bundle — nothing here builds it. The config
// exists so Storybook and Vitest can render the components: React, Tailwind,
// and the `@/` alias the shadcn CLI writes against.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
