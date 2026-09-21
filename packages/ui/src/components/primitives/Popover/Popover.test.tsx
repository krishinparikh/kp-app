import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './Popover.tsx'

const renderPopover = (props = {}) =>
  render(
    <Popover {...props}>
      <PopoverTrigger>Dimensions</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the size of the layer.</PopoverDescription>
        </PopoverHeader>
        <button type="button">Reset</button>
      </PopoverContent>
    </Popover>,
  )

describe('Popover', () => {
  it('keeps its content out of the DOM until opened', () => {
    renderPopover()
    expect(
      screen.queryByText('Set the size of the layer.'),
    ).not.toBeInTheDocument()
  })

  it('opens when the trigger is clicked', async () => {
    renderPopover()

    await userEvent.click(screen.getByRole('button', { name: 'Dimensions' }))

    expect(await screen.findByText('Set the size of the layer.')).toBeVisible()
  })

  it('marks the trigger as expanded while open', async () => {
    renderPopover({ defaultOpen: true })

    expect(screen.getByRole('button', { name: 'Dimensions' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('closes on Escape', async () => {
    renderPopover({ defaultOpen: true })
    await screen.findByText('Set the size of the layer.')

    await userEvent.keyboard('{Escape}')

    expect(
      screen.queryByText('Set the size of the layer.'),
    ).not.toBeInTheDocument()
  })

  it('keeps its own controls interactive', async () => {
    renderPopover({ defaultOpen: true })

    expect(await screen.findByRole('button', { name: 'Reset' })).toBeVisible()
  })
})
