import type { Preview } from '@storybook/react-vite'
import { TooltipProvider } from '../src/index.ts'
// Tailwind + the design tokens. Without this the canvas is unstyled.
import '../src/tokens/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    // 'todo' reports violations in the addon panel without failing anything.
    a11y: { test: 'todo' },
  },
  // shadcn's dark tokens key off a `.dark` ancestor, so the toolbar switch
  // toggles that class on the story wrapper.
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, { globals }) => (
      <div
        className={globals.theme === 'dark' ? 'dark' : ''}
        style={{ colorScheme: globals.theme }}
      >
        <div className="bg-background text-foreground p-6">
          {/* Every Radix tooltip needs a provider above it. */}
          <TooltipProvider delayDuration={0}>
            <Story />
          </TooltipProvider>
        </div>
      </div>
    ),
  ],
}

export default preview
