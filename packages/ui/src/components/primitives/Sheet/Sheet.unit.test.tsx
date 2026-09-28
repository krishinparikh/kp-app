import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './Sheet.tsx'

const renderSheet = (props = {}, contentProps = {}) =>
  render(
    <Sheet {...props}>
      <SheetTrigger>Open settings</SheetTrigger>
      <SheetContent {...contentProps}>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>This workspace only.</SheetDescription>
        </SheetHeader>
        <SheetClose>Cancel</SheetClose>
      </SheetContent>
    </Sheet>,
  )

describe('Sheet', () => {
  it('stays closed until the trigger is used', () => {
    renderSheet()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens on the trigger, titled and described', async () => {
    renderSheet()

    await userEvent.click(screen.getByRole('button', { name: 'Open settings' }))

    const sheet = await screen.findByRole('dialog')
    expect(sheet).toHaveAccessibleName('Settings')
    expect(sheet).toHaveAccessibleDescription('This workspace only.')
  })

  it('closes from a SheetClose control', async () => {
    renderSheet({ defaultOpen: true })

    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    renderSheet({ defaultOpen: true })
    await screen.findByRole('dialog')

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('exposes the side it entered from', async () => {
    renderSheet({ defaultOpen: true }, { side: 'left' })

    expect(await screen.findByRole('dialog')).toHaveAttribute(
      'data-side',
      'left',
    )
  })
})
