import { describe, expect, it } from 'vitest'
import {
  parseBlock,
  primitives,
  referencedPrimitive,
  semanticDark,
  semanticLight,
} from './tokens.ts'

describe('token parsing', () => {
  it('reads the primitive ramp', () => {
    expect(primitives.length).toBeGreaterThan(10)
    expect(primitives).toContainEqual({
      name: 'neutral-0',
      value: 'oklch(1 0 0)',
    })
  })

  it('reads both semantic themes', () => {
    expect(semanticLight.length).toBeGreaterThan(20)
    expect(semanticDark.length).toBeGreaterThan(20)
  })

  it('stops at the end of the block rather than running into the next one', () => {
    const lightNames = semanticLight.map((t) => t.name)
    expect(lightNames.filter((n) => n === 'background')).toHaveLength(1)
  })

  it('points every semantic token at a primitive that exists', () => {
    const names = new Set(primitives.map((t) => t.name))
    for (const token of [...semanticLight, ...semanticDark]) {
      expect(names, `--${token.name} -> ${token.value}`).toContain(
        referencedPrimitive(token.value),
      )
    }
  })

  it('returns nothing for a selector that is not there', () => {
    expect(parseBlock(':root { --a: 1; }', '.missing')).toEqual([])
  })

  it('unwraps a var reference', () => {
    expect(referencedPrimitive('var(--neutral-0)')).toBe('neutral-0')
    expect(referencedPrimitive('oklch(1 0 0)')).toBe('oklch(1 0 0)')
  })
})
