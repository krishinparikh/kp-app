import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  // Stories live next to their component: primitives/Button/Button.stories.tsx.
  // Add '../src/**/*.mdx' here if you ever write a hand-authored docs page.
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/react-vite',
}

export default config
