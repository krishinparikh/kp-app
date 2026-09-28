import { describe, expect, it } from 'vitest'
import {
  isColorToken,
  parseBlock,
  primitives,
  referencedPrimitive,
  resolve,
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

  it('covers the non-color scales too, not just the palette', () => {
    const names = new Set(semanticLight.map((t) => t.name))
    for (const role of [
      'text-body',
      'text-body-leading',
      'weight-emphasis',
      'elevation-overlay',
      'motion-spinner',
      'spacing-base',
    ]) {
      expect(names).toContain(role)
    }
  })

  it('resolves a semantic token to the literal behind it', () => {
    expect(resolve('var(--font-size-2)')).toBe('0.875rem')
    expect(resolve('var(--neutral-0)')).toBe('oklch(1 0 0)')
  })

  it('tells a color role apart from a type or motion one', () => {
    const light = new Map(semanticLight.map((t) => [t.name, t]))
    expect(isColorToken(light.get('muted-foreground')!)).toBe(true)
    expect(isColorToken(light.get('text-body')!)).toBe(false)
    expect(isColorToken(light.get('motion-spinner')!)).toBe(false)
  })

  it('returns nothing for a selector that is not there', () => {
    expect(parseBlock(':root { --a: 1; }', '.missing')).toEqual([])
  })

  it('unwraps a var reference', () => {
    expect(referencedPrimitive('var(--neutral-0)')).toBe('neutral-0')
    expect(referencedPrimitive('oklch(1 0 0)')).toBe('oklch(1 0 0)')
  })
})
