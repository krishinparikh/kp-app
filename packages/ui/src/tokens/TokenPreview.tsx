/**
 * The pieces both token pages render with. Not a `.stories.tsx`, so Storybook
 * leaves it out of the sidebar — it is only the shared presentation for
 * Primitives.stories.tsx and Semantics.stories.tsx.
 */
import { referencedPrimitive, resolve, type Token } from './tokens.ts'

export function Swatch({ token }: { token: string }) {
  return (
    <div
      className="border-border size-9 shrink-0 rounded-md border"
      style={{ background: `var(--${token})` }}
    />
  )
}

export function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="text-foreground max-w-5xl">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-1 mb-4 max-w-xl text-sm">
        {subtitle}
      </p>
      {children}
    </section>
  )
}

export function ColorGrid({
  tokens,
  arrow,
}: {
  tokens: Token[]
  arrow?: boolean
}) {
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
export function ValueTable({
  tokens,
  arrow,
}: {
  tokens: Token[]
  arrow?: boolean
}) {
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
