import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Switch } from './Switch.tsx'

describe('Switch', () => {
  it('renders a switch that starts off', () => {
    render(<Switch aria-label="Notifications" />)
    expect(
      screen.getByRole('switch', { name: 'Notifications' }),
    ).not.toBeChecked()
  })

  it('turns on when clicked', async () => {
    render(<Switch aria-label="Notifications" />)

    await userEvent.click(screen.getByRole('switch'))

    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('reports the new state to onCheckedChange', async () => {
    const onCheckedChange = vi.fn()
    render(
      <Switch
        aria-label="Notifications"
        defaultChecked
        onCheckedChange={onCheckedChange}
      />,
    )

    await userEvent.click(screen.getByRole('switch'))

    expect(onCheckedChange).toHaveBeenCalledWith(false)
  })

  it('does not toggle while disabled', async () => {
    render(<Switch disabled aria-label="Notifications" />)

    await userEvent.click(screen.getByRole('switch'))

    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  it('exposes the size as a data attribute', () => {
    render(<Switch size="sm" aria-label="Notifications" />)
    expect(screen.getByRole('switch')).toHaveAttribute('data-size', 'sm')
  })
})
