/**
 * Adds shadcn components and reshapes them into the folder-per-component
 * layout this app uses.
 *
 *   pnpm ui:add select checkbox
 *
 * The shadcn CLI writes flat kebab-case files (primitives/select.tsx). This
 * moves each new file to primitives/Select/Select.tsx, adds an `index.ts`
 * barrel plus story and test stubs, and rewrites the imports shadcn generates.
 *
 * Those imports use the `@/` alias, which no shipped file here may keep: a
 * consuming app maps `@` to its own src, so `@/components/primitives/Button`
 * would resolve into the app and break. They are rewritten to relative paths,
 * and `@/lib/utils` to the `cn` package every component already uses.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const packageRoot = path.resolve(import.meta.dirname, '..')
const primitivesDir = path.join(packageRoot, 'src/components/primitives')

const components = process.argv.slice(2)
if (components.length === 0) {
  console.error('Usage: pnpm ui:add <component> [...more]')
  process.exit(1)
}

const pascal = (kebab: string) =>
  kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

/** Flat .tsx files sitting directly in primitives/ — i.e. freshly added ones. */
const flatFiles = () =>
  fs
    .readdirSync(primitivesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
    .map((entry) => entry.name)

fs.mkdirSync(primitivesDir, { recursive: true })

execFileSync(
  'pnpm',
  ['dlx', 'shadcn@latest', 'add', ...components, '--yes', '--overwrite'],
  { cwd: packageRoot, stdio: 'inherit' },
)

const added = flatFiles()
if (added.length === 0) {
  console.log('Nothing new to restructure.')
  process.exit(0)
}

const renames = new Map<string, string>()

for (const file of added) {
  const kebab = file.replace(/\.tsx$/, '')
  const name = pascal(kebab)
  const dir = path.join(primitivesDir, name)

  renames.set(kebab, name)
  fs.mkdirSync(dir, { recursive: true })
  fs.renameSync(path.join(primitivesDir, file), path.join(dir, `${name}.tsx`))

  writeIfMissing(path.join(dir, 'index.ts'), `export * from './${name}.tsx'\n`)
  writeIfMissing(path.join(dir, `${name}.stories.tsx`), storyStub(name))
  writeIfMissing(path.join(dir, `${name}.test.tsx`), testStub(name))
}

// Every file sits at primitives/<Name>/<file>, so a sibling component is
// always '../<Name>/index.ts'.
for (const file of walk(primitivesDir)) {
  const before = fs.readFileSync(file, 'utf8')
  const after = before
    .replace(
      /@\/components\/primitives\/([a-zA-Z0-9-]+)/g,
      (_, target) => `../${pascal(target)}/index.ts`,
    )
    .replaceAll('@/lib/utils', 'cn')
  if (after !== before) fs.writeFileSync(file, after)
}

// components.json points the CLI's `utils` alias at @/lib/utils, so it creates
// that file if it's missing. The imports above now read the `cn` package
// directly, so the re-export it wrote is dead — drop it.
fs.rmSync(path.join(packageRoot, 'src/lib'), { recursive: true, force: true })

rewriteRootBarrel()

console.log(
  `Restructured: ${[...renames.values()].join(', ')}\n` +
    'Fill in the generated .stories.tsx and .test.tsx files, then run `pnpm format`.',
)

function writeIfMissing(file: string, contents: string) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, contents)
}

function* walk(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (/\.tsx?$/.test(entry.name)) yield full
  }
}

/** Rebuild primitives/index.ts from whatever folders exist. */
function rewriteRootBarrel() {
  const folders = fs
    .readdirSync(primitivesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  const body = folders
    .map((name) => `export * from './${name}/index.ts'`)
    .join('\n')

  fs.writeFileSync(
    path.join(primitivesDir, 'index.ts'),
    '// Re-exports every primitive. src/index.ts re-exports this in turn, so an\n' +
      "// app writes `import { Button } from '@kp-app/ui'`.\n" +
      `${body}\n`,
  )
}

function storyStub(name: string) {
  return `import type { Meta, StoryObj } from '@storybook/react-vite'
import { ${name} } from './${name}.tsx'

const meta = {
  title: 'Primitives/${name}',
  component: ${name},
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ${name}>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
`
}

function testStub(name: string) {
  return `import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ${name} } from './${name}.tsx'

describe('${name}', () => {
  it('renders', () => {
    const { container } = render(<${name} />)
    expect(container).toBeTruthy()
  })
})
`
}
