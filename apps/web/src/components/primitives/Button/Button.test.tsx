import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button.tsx'

describe('Button', () => {
  it('renders its children as a button', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toBeVisible()
  })

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire onClick while disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('exposes variant and size as data attributes', () => {
    render(
      <Button variant="destructive" size="sm">
        Delete
      </Button>,
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-variant', 'destructive')
    expect(button).toHaveAttribute('data-size', 'sm')
  })

  it('merges a custom className instead of dropping it', () => {
    render(<Button className="w-full">Save</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })

  it('renders the child element when asChild is set', () => {
    render(
      <Button asChild>
        <a href="/settings">Settings</a>
      </Button>,
    )

    const link = screen.getByRole('link', { name: 'Settings' })
    expect(link).toHaveAttribute('data-slot', 'button')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
