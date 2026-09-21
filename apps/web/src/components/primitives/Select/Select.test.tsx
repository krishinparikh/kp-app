import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select.tsx'

const renderSelect = (props = {}) =>
  render(
    <Select {...props}>
      <SelectTrigger aria-label="Environment">
        <SelectValue placeholder="Pick one" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="staging">Staging</SelectItem>
        <SelectItem value="production">Production</SelectItem>
      </SelectContent>
    </Select>,
  )

describe('Select', () => {
  it('shows the placeholder until something is picked', () => {
    renderSelect()
    expect(
      screen.getByRole('combobox', { name: 'Environment' }),
    ).toHaveTextContent('Pick one')
  })

  it('opens the list when the trigger is clicked', async () => {
    renderSelect()

    await userEvent.click(screen.getByRole('combobox'))

    expect(await screen.findByRole('option', { name: 'Staging' })).toBeVisible()
    expect(screen.getByRole('option', { name: 'Production' })).toBeVisible()
  })

  it('puts the chosen option on the trigger', async () => {
    renderSelect()

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Production' }),
    )

    expect(screen.getByRole('combobox')).toHaveTextContent('Production')
  })

  it('reports the chosen value to onValueChange', async () => {
    const onValueChange = vi.fn()
    renderSelect({ onValueChange })

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Staging' }),
    )

    expect(onValueChange).toHaveBeenCalledWith('staging')
  })

  it('does not open while disabled', async () => {
    renderSelect({ disabled: true })

    await userEvent.click(screen.getByRole('combobox'))

    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })
})
