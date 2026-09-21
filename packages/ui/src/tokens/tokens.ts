/**
 * Reads the token files at build time so anything displaying them — the
 * Storybook reference page — stays in step with the actual source of truth.
 */
import primitivesCss from './primitives.css?raw'
import semanticsCss from './semantics.css?raw'

export type Token = { name: string; value: string }

/** Every `--name: value;` inside the given selector's block. */
export function parseBlock(css: string, selector: string): Token[] {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) return []
  const body = css.slice(start, css.indexOf('\n}', start))
  return [...body.matchAll(/^\s*--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/gm)].map(
    (m) => ({
      name: m[1],
      value: m[2].trim(),
    }),
  )
}

export const primitives = parseBlock(primitivesCss, ':root')
export const semanticLight = parseBlock(semanticsCss, ':root')
export const semanticDark = parseBlock(semanticsCss, '.dark')

/** `var(--neutral-0)` -> `neutral-0`. Returns the value unchanged otherwise. */
export const referencedPrimitive = (value: string) =>
  /^var\(--([a-zA-Z0-9-]+)\)$/.exec(value)?.[1] ?? value

export const isColor = (value: string) => value.startsWith('oklch')

/** The literal a semantic token resolves to, for display next to its name. */
const byName = new Map(primitives.map((t) => [t.name, t.value]))
export const resolve = (value: string) =>
  byName.get(referencedPrimitive(value)) ?? value

/** A semantic token is a color when the primitive it points at is one. */
export const isColorToken = (token: Token) => isColor(resolve(token.value))
