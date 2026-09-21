import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip.tsx'

const renderTooltip = () =>
  render(
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>Add item</TooltipTrigger>
        <TooltipContent>Adds a row to the table</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  )

describe('Tooltip', () => {
  it('stays hidden until the trigger is reached', () => {
    renderTooltip()
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('opens on hover', async () => {
    renderTooltip()

    await userEvent.hover(screen.getByRole('button', { name: 'Add item' }))

    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Adds a row to the table',
    )
  })

  it('opens on keyboard focus', async () => {
    renderTooltip()

    await userEvent.tab()

    expect(await screen.findByRole('tooltip')).toBeVisible()
  })

  it('describes its trigger while open', async () => {
    renderTooltip()

    await userEvent.hover(screen.getByRole('button', { name: 'Add item' }))
    await screen.findByRole('tooltip')

    expect(
      screen.getByRole('button', { name: 'Add item' }),
    ).toHaveAccessibleDescription('Adds a row to the table')
  })
})
