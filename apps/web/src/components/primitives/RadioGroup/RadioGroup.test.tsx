import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Label } from '../Label/Label.tsx'
import { RadioGroup, RadioGroupItem } from './RadioGroup.tsx'

const renderGroup = (props = {}) =>
  render(
    <RadioGroup defaultValue="monthly" {...props}>
      <Label className="flex gap-2">
        <RadioGroupItem value="monthly" />
        Monthly
      </Label>
      <Label className="flex gap-2">
        <RadioGroupItem value="yearly" />
        Yearly
      </Label>
    </RadioGroup>,
  )

describe('RadioGroup', () => {
  it('renders one radio per option', () => {
    renderGroup()
    expect(screen.getAllByRole('radio')).toHaveLength(2)
  })

  it('starts on the default value', () => {
    renderGroup()
    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked()
  })

  it('moves the selection when another option is clicked', async () => {
    renderGroup()

    await userEvent.click(screen.getByRole('radio', { name: 'Yearly' }))

    expect(screen.getByRole('radio', { name: 'Yearly' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Monthly' })).not.toBeChecked()
  })

  it('reports the new value to onValueChange', async () => {
    const onValueChange = vi.fn()
    renderGroup({ onValueChange })

    await userEvent.click(screen.getByRole('radio', { name: 'Yearly' }))

    expect(onValueChange).toHaveBeenCalledWith('yearly')
  })

  it('does not change selection while disabled', async () => {
    renderGroup({ disabled: true })

    await userEvent.click(screen.getByRole('radio', { name: 'Yearly' }))

    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked()
  })
})
