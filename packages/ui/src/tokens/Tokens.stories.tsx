import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  isColor,
  isColorToken,
  primitives,
  referencedPrimitive,
  resolve,
  semanticDark,
  semanticLight,
  type Token,
} from './tokens.ts'

function Swatch({ token }: { token: string }) {
  return (
    <div
      className="border-border size-9 shrink-0 rounded-md border"
      style={{ background: `var(--${token})` }}
    />
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-1 mb-4 max-w-xl text-sm">
        {subtitle}
      </p>
      {children}
    </section>
  )
}

function ColorGrid({ tokens, arrow }: { tokens: Token[]; arrow?: boolean }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
      {tokens.map((token) => (
        <div key={token.name} className="flex items-center gap-3">
          <Swatch token={token.name} />
          <div className="min-w-0">
            <div className="text-foreground font-mono text-xs font-medium">
              --{token.name}
            </div>
            <div className="text-muted-foreground truncate font-mono text-xs">
              {arrow ? `→ ${referencedPrimitive(token.value)}` : token.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* Type, layout, elevation and motion have no swatch — show the value instead,
 * and for a semantic token the primitive it lands on. */
function ValueTable({ tokens, arrow }: { tokens: Token[]; arrow?: boolean }) {
  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <table className="w-full font-mono text-xs">
        <tbody>
          {tokens.map((token, i) => (
            <tr
              key={token.name}
              className={i > 0 ? 'border-border border-t' : undefined}
            >
              <td className="text-foreground px-3 py-1.5 align-top font-medium whitespace-nowrap">
                --{token.name}
              </td>
              {arrow && (
                <td className="text-muted-foreground px-3 py-1.5 align-top whitespace-nowrap">
                  → --{referencedPrimitive(token.value)}
                </td>
              )}
              <td className="text-muted-foreground w-full px-3 py-1.5 align-top">
                {arrow ? resolve(token.value) : token.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Primitives() {
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

function Semantic() {
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

function TokenReference() {
  return (
    <div className="text-foreground max-w-5xl">
      <Primitives />
      <Semantic />
    </div>
  )
}

const meta = {
  title: 'Design Tokens/Reference',
  component: TokenReference,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TokenReference>

export default meta
type Story = StoryObj<typeof meta>

export const Reference: Story = {}
