import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Label } from '../Label/Label.tsx'
import { Checkbox } from './Checkbox.tsx'

describe('Checkbox', () => {
  it('renders an unchecked checkbox by default', () => {
    render(<Checkbox aria-label="Accept" />)
    expect(screen.getByRole('checkbox', { name: 'Accept' })).not.toBeChecked()
  })

  it('checks when clicked', async () => {
    render(<Checkbox aria-label="Accept" />)

    await userEvent.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('reports the new state to onCheckedChange', async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Accept" onCheckedChange={onCheckedChange} />)

    await userEvent.click(screen.getByRole('checkbox'))

    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('does not toggle while disabled', async () => {
    render(<Checkbox disabled aria-label="Accept" />)

    await userEvent.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('takes its name from a wrapping label', () => {
    render(
      <Label>
        <Checkbox />
        Accept the terms
      </Label>,
    )

    expect(
      screen.getByRole('checkbox', { name: 'Accept the terms' }),
    ).toBeVisible()
  })

  it('exposes the indeterminate state', () => {
    render(<Checkbox checked="indeterminate" aria-label="Accept" />)
    expect(screen.getByRole('checkbox')).toBePartiallyChecked()
  })
})
