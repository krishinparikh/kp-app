import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Input } from '../Input/Input.tsx'
import { Label } from './Label.tsx'

describe('Label', () => {
  it('names the input it points at', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </>,
    )

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeVisible()
  })

  it('focuses that input when clicked', async () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </>,
    )

    await userEvent.click(screen.getByText('Email'))

    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('names a control it wraps', () => {
    render(
      <Label>
        Email
        <Input />
      </Label>,
    )

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeVisible()
  })
})
