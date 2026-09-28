import type { Meta, StoryObj } from '@storybook/react-vite'
import { ColorGrid, Section, ValueTable } from './TokenPreview.tsx'
import { isColorToken, semanticDark, semanticLight } from './tokens.ts'

function SemanticColors() {
  // Dark only overrides a subset; anything it omits inherits from :root.
  const light = semanticLight.filter(isColorToken)
  const darkByName = new Map(semanticDark.map((t) => [t.name, t]))
  const dark = light.map((t) => darkByName.get(t.name) ?? t)

  return (
    <>
      <h3 className="mb-2 text-sm font-medium">Light</h3>
      <ColorGrid tokens={light} arrow />
      <h3 className="mt-6 mb-2 text-sm font-medium">Dark</h3>
      <div className="dark">
        <div className="bg-background border-border rounded-lg border p-4">
          <ColorGrid tokens={dark} arrow />
        </div>
      </div>
    </>
  )
}

/** What each role resolves to, and which primitive it lands on. */
function SemanticTokens() {
  const rest = semanticLight.filter((t) => !isColorToken(t))

  return (
    <Section
      title="Semantic tokens"
      subtitle="Named for what they are for. Each one points at exactly one primitive. Colors swap to a different primitive in dark mode; type, layout, elevation and motion are declared once, because they don't change with the theme."
    >
      <SemanticColors />
      {rest.length > 0 && (
        <>
          <h3 className="mt-6 mb-2 text-sm font-medium">
            Type, layout, elevation and motion
          </h3>
          <ValueTable tokens={rest} arrow />
        </>
      )}
    </Section>
  )
}

const meta = {
  title: 'Design Tokens/Semantics',
  component: SemanticTokens,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SemanticTokens>

export default meta
type Story = StoryObj<typeof meta>

export const Semantics: Story = {}
