import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Separator } from './Separator.tsx'

describe('Separator', () => {
  it('is hidden from assistive tech by default', () => {
    render(<Separator data-testid="separator" />)

    expect(screen.queryByRole('separator')).not.toBeInTheDocument()
    expect(screen.getByTestId('separator')).toBeVisible()
  })

  it('becomes a real separator when not decorative', () => {
    render(<Separator decorative={false} />)
    expect(screen.getByRole('separator')).toBeVisible()
  })

  it('reports its orientation', () => {
    render(<Separator decorative={false} orientation="vertical" />)
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    )
  })
})
