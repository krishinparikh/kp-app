import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Input } from './Input.tsx'

describe('Input', () => {
  it('renders a textbox with its placeholder', () => {
    render(<Input placeholder="Email" />)
    expect(screen.getByRole('textbox', { name: '' })).toBeVisible()
    expect(screen.getByPlaceholderText('Email')).toBeVisible()
  })

  it('records what the user types', async () => {
    render(<Input placeholder="Email" />)

    await userEvent.type(screen.getByRole('textbox'), 'hello@example.com')

    expect(screen.getByRole('textbox')).toHaveValue('hello@example.com')
  })

  it('ignores typing while disabled', async () => {
    render(<Input disabled placeholder="Email" />)

    await userEvent.type(screen.getByRole('textbox'), 'nope')

    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('exposes the invalid state to assistive tech', () => {
    render(<Input aria-invalid placeholder="Email" />)
    expect(screen.getByRole('textbox')).toBeInvalid()
  })

  it('passes the type through', () => {
    render(<Input type="password" placeholder="Password" />)
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute(
      'type',
      'password',
    )
  })

  it('merges a custom className instead of dropping it', () => {
    render(<Input className="w-full" placeholder="Email" />)
    expect(screen.getByRole('textbox')).toHaveClass('w-full')
  })
})
