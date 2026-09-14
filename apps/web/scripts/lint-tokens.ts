/**
 * Enforces the design-token layering described in src/styles/README.md:
 *
 *   primitives.css  raw values, referencing nothing
 *   semantics.css   references primitives, and only primitives
 *   theme.css       references semantics for color and radius
 *   components      use the utility classes theme.css grants, and nothing else
 *
 * Most of the boundary is already structural. Primitives and semantics live
 * outside `@theme`, so no utility class maps to one; and theme.css opens with
 * `--*: initial`, so every Tailwind default is deleted. This catches what
 * structure can't — arbitrary-value escape hatches (`bg-[#fff]`), leftover
 * references to the deleted palette, and drift inside the token files.
 *
 * Runs as part of `pnpm lint`.
 */
import fs from 'node:fs'
import path from 'node:path'

const webRoot = path.resolve(import.meta.dirname, '..')
const stylesDir = path.join(webRoot, 'src/styles')
const srcDir = path.join(webRoot, 'src')

type Problem = { file: string; line: number; message: string }
const problems: Problem[] = []

const report = (file: string, line: number, message: string) =>
  problems.push({ file: path.relative(webRoot, file), line, message })

type Declaration = {
  name: string
  value: string
  line: number
  /** The selector or at-rule this sits inside, e.g. `:root` or `@theme inline`. */
  block: string
}

/**
 * Every `--name: value;` in a file, tagged with the block it sits in. Block
 * tracking is what lets semantic.css hold both the tokens and the `@theme`
 * registration without the two being confused for each other.
 */
function declarations(file: string): Declaration[] {
  const out: Declaration[] = []
  let depth = 0
  let block = ''

  fs.readFileSync(file, 'utf8')
    .split('\n')
    .forEach((text, index) => {
      const declaration = /^\s*(--[a-zA-Z0-9-]*\*?)\s*:\s*([^;]+);/.exec(text)
      if (declaration) {
        out.push({
          name: declaration[1],
          value: declaration[2].trim(),
          line: index + 1,
          block,
        })
      } else if (depth === 0 && text.trimEnd().endsWith('{')) {
        block = text.replace('{', '').trim()
      }
      depth += (text.match(/{/g) ?? []).length - (text.match(/}/g) ?? []).length
    })

  return out
}

const primitivesFile = path.join(stylesDir, 'primitives.css')
const semanticsFile = path.join(stylesDir, 'semantics.css')
const themeFile = path.join(stylesDir, 'theme.css')

const primitives = declarations(primitivesFile)
const semantics = declarations(semanticsFile)
const theme = declarations(themeFile)

const primitiveNames = new Set(primitives.map((d) => d.name))
const semanticNames = new Set(semantics.map((d) => d.name))
const themeNames = new Set(theme.map((d) => d.name))

// ---------------------------------------------------------------- layer 1
// Primitives are literals. A primitive that references anything else is a
// semantic token wearing the wrong hat.
for (const { name, value, line } of primitives) {
  if (value.includes('var(')) {
    report(
      primitivesFile,
      line,
      `${name} references another token. Primitives must be literal values.`,
    )
  }
}

// Names are unprefixed, so guard against colliding with a Tailwind theme key —
// both land in :root and the later one would silently win.
const themeEmitted = new Set(
  theme.filter((d) => !d.name.endsWith('-*')).map((d) => d.name),
)
for (const { name, line } of primitives) {
  if (themeEmitted.has(name)) {
    report(
      primitivesFile,
      line,
      `${name} collides with a theme variable of the same name in theme.css.`,
    )
  }
}

// ---------------------------------------------------------------- layer 2
// Semantics point at exactly one primitive. No literals, no calc, no chaining
// to another semantic token — that would make the palette impossible to trace.
for (const { name, value, line } of semantics) {
  const single = /^var\((--[a-zA-Z0-9-]+)\)$/.exec(value)
  if (!single) {
    report(
      semanticsFile,
      line,
      `${name} must be exactly \`var(--some-primitive)\`, got \`${value}\`.`,
    )
    continue
  }
  const target = single[1]
  if (primitiveNames.has(target)) continue
  const hint = semanticNames.has(target)
    ? 'that is a semantic token — point at the primitive it resolves to instead'
    : 'no such primitive in primitives.css'
  report(semanticsFile, line, `${name} references ${target}: ${hint}.`)
}

// ---------------------------------------------------------------- layer 3
// The theme may only surface semantics. Bare keywords are fine; a primitive or
// a raw color here would hand components a way around the semantic layer.
const KEYWORDS = new Set([
  'initial',
  'transparent',
  'currentColor',
  'inherit',
  'none',
  '0',
  'calc(infinity * 1px)',
])
for (const { name, value, line } of theme) {
  if (!/^--(color|radius)-/.test(name)) continue // other scales are plain values
  if (KEYWORDS.has(value)) continue

  const referenced = [...value.matchAll(/var\((--[a-zA-Z0-9-]+)\)/g)].map(
    (m) => m[1],
  )
  if (referenced.length === 0) {
    report(
      themeFile,
      line,
      `${name} is a literal value. Theme entries must read a semantic token.`,
    )
    continue
  }
  for (const target of referenced) {
    if (semanticNames.has(target)) continue
    const hint = primitiveNames.has(target)
      ? 'that is a primitive — the theme may only read semantic tokens'
      : 'no such semantic token in semantics.css'
    report(themeFile, line, `${name} references ${target}: ${hint}.`)
  }
}

// -------------------------------------------------------------- the wipe
// `--*: initial` is what deletes Tailwind's defaults. Without it every built-in
// class quietly comes back.
const wipe = theme.find((d) => d.name === '--*')
if (wipe?.value !== 'initial') {
  report(
    themeFile,
    wipe?.line ?? 1,
    'theme.css must declare `--*: initial;` so Tailwind ships no defaults of its own.',
  )
}

/**
 * The utility classes Tailwind ships but this theme does not define — computed
 * by diffing Tailwind's own default theme against ours, so it stays correct as
 * theme.css changes. Using one of these generates no CSS, which fails silently
 * in the browser; naming them here turns that into a lint error.
 */
function deletedClasses(): Map<string, string> {
  const defaultsFile = path.join(webRoot, 'node_modules/tailwindcss/theme.css')
  if (!fs.existsSync(defaultsFile)) return new Map()

  // namespace -> the utility prefixes that read it
  const namespaces: [string, string[]][] = [
    [
      '--color-',
      [
        'bg',
        'text',
        'border',
        'ring',
        'fill',
        'stroke',
        'from',
        'via',
        'to',
        'outline',
        'decoration',
        'divide',
        'accent',
        'caret',
        'placeholder',
        'shadow',
      ],
    ],
    ['--text-', ['text']],
    ['--font-weight-', ['font']],
    ['--radius-', ['rounded']],
    ['--shadow-', ['shadow']],
    ['--container-', ['max-w']],
    ['--tracking-', ['tracking']],
    ['--leading-', ['leading']],
    ['--ease-', ['ease']],
    ['--animate-', ['animate']],
    ['--blur-', ['blur', 'backdrop-blur']],
    ['--aspect-', ['aspect']],
  ]

  // Tailwind also has bare utilities that read an unsuffixed theme key —
  // `rounded` reads `--radius`, `shadow` reads `--shadow`.
  const bare: Record<string, string> = {
    '--radius': 'rounded',
    '--shadow': 'shadow',
    '--blur': 'blur',
    '--drop-shadow': 'drop-shadow',
    '--text-shadow': 'text-shadow',
  }

  const out = new Map<string, string>()
  for (const { name } of declarations(defaultsFile)) {
    if (name.includes('--line-height') || themeNames.has(name)) continue

    if (bare[name]) {
      out.set(bare[name], name)
      continue
    }
    for (const [namespace, prefixes] of namespaces) {
      if (!name.startsWith(namespace)) continue
      const step = name.slice(namespace.length)
      if (!step) continue
      for (const prefix of prefixes) out.set(`${prefix}-${step}`, name)
    }
  }
  return out
}

const deleted = deletedClasses()

// ---------------------------------------------------------------- components
// Anything outside src/styles/ speaks in class names. Referencing a primitive,
// or writing a raw color, is a component reaching past the semantic layer.
//
// Composing semantic tokens inline IS allowed — shadcn does it for hover
// states, e.g. `hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]`.
// That consumes nothing but semantic tokens, which is the rule.
const COLOR_LITERAL =
  /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/
const VAR_CALL = /var\((--[a-zA-Z0-9-]+)[^)]*\)/g
const BARE_VAR_UTILITY = /-\[var\((--[a-zA-Z0-9-]+)\)\]/g

/**
 * Class names in a line of source, with their variant prefixes stripped
 * (`dark:hover:bg-red-500` -> `bg-red-500`). Brackets are tracked so the colons
 * inside an arbitrary variant don't split it.
 */
function classTokens(code: string): string[] {
  const out: string[] = []
  for (const [, doubled, singled] of code.matchAll(
    /"([^"\n]*)"|'([^'\n]*)'/g,
  )) {
    for (const token of (doubled ?? singled ?? '').split(/\s+/)) {
      if (!token || token.includes('[') || token.includes('/')) continue
      let depth = 0
      let start = 0
      for (let i = 0; i < token.length; i++) {
        if (token[i] === '(') depth++
        else if (token[i] === ')') depth--
        else if (token[i] === ':' && depth === 0) start = i + 1
      }
      out.push(token.slice(start))
    }
  }
  return out
}

function* sourceFiles(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (full === stylesDir) continue
    if (entry.isDirectory()) yield* sourceFiles(full)
    else if (/\.(tsx?|css)$/.test(entry.name) && !entry.name.endsWith('.d.ts'))
      yield full
  }
}

for (const file of sourceFiles(srcDir)) {
  fs.readFileSync(file, 'utf8')
    .split('\n')
    .forEach((text, index) => {
      const line = index + 1
      const code = text.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '')

      for (const [, target] of code.matchAll(VAR_CALL)) {
        if (primitiveNames.has(target)) {
          report(
            file,
            line,
            `reads the primitive ${target}. Components may only use semantic tokens.`,
          )
        }
      }

      // `bg-[var(--muted)]` is a long way to write `bg-muted`.
      for (const [, target] of code.matchAll(BARE_VAR_UTILITY)) {
        if (semanticNames.has(target)) {
          report(
            file,
            line,
            `uses \`var(${target})\` as a bare arbitrary value. Use the generated class instead.`,
          )
        }
      }

      // Check for literal colors only in what is left once token references are
      // removed, so a color-mix of semantic tokens passes.
      if (COLOR_LITERAL.test(code.replace(VAR_CALL, ''))) {
        report(
          file,
          line,
          'raw color value. Use a semantic class (bg-muted, text-foreground, …).',
        )
      }

      for (const utility of classTokens(code)) {
        const source = deleted.get(utility)
        if (source) {
          report(
            file,
            line,
            `\`${utility}\` is a Tailwind default this theme deletes (${source}), so it generates no CSS. Use a class theme.css defines.`,
          )
        }
      }
    })
}

// ---------------------------------------------------------------- output
const unusedPrimitives = primitives
  .map((d) => d.name)
  .filter((name) => !semantics.some((s) => s.value.includes(`var(${name})`)))

if (unusedPrimitives.length > 0) {
  console.log(
    `note: ${unusedPrimitives.length} primitive(s) no semantic token uses: ${unusedPrimitives.join(', ')}`,
  )
}

if (problems.length === 0) {
  console.log(
    `Tokens OK — ${primitives.length} primitives, ${semantics.length} semantic, ${theme.length} exposed as classes.`,
  )
  process.exit(0)
}

for (const { file, line, message } of problems) {
  console.error(`${file}:${line}: ${message}`)
}
console.error(
  `\n${problems.length} token layering violation(s). See src/styles/README.md.`,
)
process.exit(1)
