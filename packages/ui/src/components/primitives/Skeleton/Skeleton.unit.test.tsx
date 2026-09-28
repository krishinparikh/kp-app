import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './Skeleton.tsx'

describe('Skeleton', () => {
  it('renders a placeholder element', () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).toHaveAttribute(
      'data-slot',
      'skeleton',
    )
  })

  it('merges the sizing className it is given', () => {
    render(<Skeleton data-testid="skeleton" className="h-4 w-48" />)

    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('h-4')
    expect(skeleton).toHaveClass('w-48')
  })

  it('stays out of the accessibility tree by default', () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).not.toHaveAttribute('role')
  })
})
