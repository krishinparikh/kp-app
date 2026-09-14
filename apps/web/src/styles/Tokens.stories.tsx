import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  isColor,
  primitives,
  referencedPrimitive,
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

function Primitives() {
  const colors = primitives.filter((t) => isColor(t.value))
  const rest = primitives.filter((t) => !isColor(t.value))

  return (
    <Section
      title="Primitive tokens"
      subtitle="Raw values, named for what they are. Defined in src/styles/primitives.css, outside @theme — so no utility class reaches them. Only semantics.css may read these."
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3">
        {colors.map((token) => (
          <div key={token.name} className="flex items-center gap-3">
            <Swatch token={token.name} />
            <div className="min-w-0">
              <div className="font-mono text-xs font-medium">
                --{token.name}
              </div>
              <div className="text-muted-foreground truncate font-mono text-xs">
                {token.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      {rest.length > 0 && (
        <dl className="mt-5 flex gap-6 font-mono text-xs">
          {rest.map((token) => (
            <div key={token.name}>
              <dt className="font-medium">--{token.name}</dt>
              <dd className="text-muted-foreground">{token.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Section>
  )
}

function SemanticRows({ tokens, dark }: { tokens: Token[]; dark: boolean }) {
  return (
    <div className={dark ? 'dark' : undefined}>
      <div className="bg-background border-border grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 rounded-lg border p-4">
        {tokens.map((token) => (
          <div key={token.name} className="flex items-center gap-3">
            <Swatch token={token.name} />
            <div className="min-w-0">
              <div className="text-foreground font-mono text-xs font-medium">
                --{token.name}
              </div>
              <div className="text-muted-foreground truncate font-mono text-xs">
                → {referencedPrimitive(token.value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Semantic() {
  // Dark only overrides a subset; anything it omits inherits from :root.
  const darkByName = new Map(semanticDark.map((t) => [t.name, t]))
  const darkTokens = semanticLight.map((t) => darkByName.get(t.name) ?? t)

  return (
    <Section
      title="Semantic tokens"
      subtitle="Named for what they are for. Each one points at exactly one primitive, and swaps to a different primitive in dark mode. These are the names shadcn components use."
    >
      <h3 className="mb-2 text-sm font-medium">Light</h3>
      <SemanticRows tokens={semanticLight} dark={false} />
      <h3 className="mt-6 mb-2 text-sm font-medium">Dark</h3>
      <SemanticRows tokens={darkTokens} dark />
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
