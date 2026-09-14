import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

// Component tests reuse the app's Vite config (aliases, React, Tailwind) and
// run against jsdom. Storybook is separate: stories are for looking at, tests
// are for asserting.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      css: true,
      coverage: {
        provider: 'v8',
        include: ['src/components/**/*.tsx'],
        exclude: ['**/*.stories.tsx'],
      },
    },
  }),
)
