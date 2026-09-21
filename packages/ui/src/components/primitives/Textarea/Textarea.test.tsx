import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Textarea } from './Textarea.tsx'

describe('Textarea', () => {
  it('renders a multiline textbox', () => {
    render(<Textarea placeholder="Notes" />)
    expect(screen.getByRole('textbox')).toBeVisible()
  })

  it('records multi-line input', async () => {
    render(<Textarea placeholder="Notes" />)

    await userEvent.type(screen.getByRole('textbox'), 'first{enter}second')

    expect(screen.getByRole('textbox')).toHaveValue('first\nsecond')
  })

  it('ignores typing while disabled', async () => {
    render(<Textarea disabled placeholder="Notes" />)

    await userEvent.type(screen.getByRole('textbox'), 'nope')

    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('exposes the invalid state to assistive tech', () => {
    render(<Textarea aria-invalid placeholder="Notes" />)
    expect(screen.getByRole('textbox')).toBeInvalid()
  })
})
