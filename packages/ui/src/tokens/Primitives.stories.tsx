import type { Meta, StoryObj } from '@storybook/react-vite'
import { ColorGrid, Section, ValueTable } from './TokenPreview.tsx'
import { isColor, primitives } from './tokens.ts'

/** Every raw value the system owns, read straight out of primitives.css. */
function PrimitiveTokens() {
  const colors = primitives.filter((t) => isColor(t.value))
  const rest = primitives.filter((t) => !isColor(t.value))

  return (
    <Section
      title="Primitive tokens"
      subtitle="Raw values, named for what they are — a step on a ramp, not a job. Defined in src/tokens/primitives.css, outside @theme, so no utility class reaches them. Only semantics.css may read these."
    >
      <ColorGrid tokens={colors} />
      {rest.length > 0 && (
        <div className="mt-5">
          <ValueTable tokens={rest} />
        </div>
      )}
    </Section>
  )
}

const meta = {
  title: 'Design Tokens/Primitives',
  component: PrimitiveTokens,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PrimitiveTokens>

export default meta
type Story = StoryObj<typeof meta>

export const Primitives: Story = {}
