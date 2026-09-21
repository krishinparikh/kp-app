import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu.tsx'

const renderMenu = (props = {}, onSelect = vi.fn()) => {
  render(
    <DropdownMenu {...props}>
      <DropdownMenuTrigger>Account</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSelect}>Profile</DropdownMenuItem>
        <DropdownMenuItem disabled>Billing</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  )
  return onSelect
}

describe('DropdownMenu', () => {
  it('keeps its items out of the DOM until opened', () => {
    renderMenu()
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument()
  })

  it('opens when the trigger is clicked', async () => {
    renderMenu()

    await userEvent.click(screen.getByRole('button', { name: 'Account' }))

    expect(await screen.findByRole('menu')).toBeVisible()
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toBeVisible()
  })

  it('runs onSelect and closes when an item is chosen', async () => {
    const onSelect = renderMenu({ defaultOpen: true })

    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Profile' }),
    )

    expect(onSelect).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('leaves disabled items unselectable', async () => {
    renderMenu({ defaultOpen: true })

    const billing = await screen.findByRole('menuitem', { name: 'Billing' })
    expect(billing).toHaveAttribute('aria-disabled', 'true')
  })

  it('closes on Escape', async () => {
    renderMenu({ defaultOpen: true })
    await screen.findByRole('menu')

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
