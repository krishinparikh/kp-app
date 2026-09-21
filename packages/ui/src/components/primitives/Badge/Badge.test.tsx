import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge.tsx'

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeVisible()
  })

  it('exposes the variant as a data attribute', () => {
    render(<Badge variant="destructive">Failed</Badge>)
    expect(screen.getByText('Failed')).toHaveAttribute(
      'data-variant',
      'destructive',
    )
  })

  it('renders the child element when asChild is set', () => {
    render(
      <Badge asChild>
        <a href="/releases">v1.4.0</a>
      </Badge>,
    )

    expect(screen.getByRole('link', { name: 'v1.4.0' })).toHaveAttribute(
      'data-slot',
      'badge',
    )
  })

  it('merges a custom className instead of dropping it', () => {
    render(<Badge className="uppercase">New</Badge>)
    expect(screen.getByText('New')).toHaveClass('uppercase')
  })
})
