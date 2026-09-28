import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog.tsx'

const renderDialog = (props = {}) =>
  render(
    <Dialog {...props}>
      <DialogTrigger>Edit profile</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Saved on submit.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>,
  )

describe('Dialog', () => {
  it('stays closed until the trigger is used', () => {
    renderDialog()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens on the trigger, titled and described', async () => {
    renderDialog()

    await userEvent.click(screen.getByRole('button', { name: 'Edit profile' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAccessibleName('Edit profile')
    expect(dialog).toHaveAccessibleDescription('Saved on submit.')
  })

  it('closes from a DialogClose control', async () => {
    renderDialog({ defaultOpen: true })

    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    renderDialog({ defaultOpen: true })
    await screen.findByRole('dialog')

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the corner close button unless it is turned off', async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Terms</DialogTitle>
          <DialogDescription>Read before continuing.</DialogDescription>
        </DialogContent>
      </Dialog>,
    )

    await screen.findByRole('dialog')
    expect(
      screen.queryByRole('button', { name: /close/i }),
    ).not.toBeInTheDocument()
  })
})
