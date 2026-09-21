import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog.tsx'

const renderAlertDialog = (props = {}, onConfirm = vi.fn()) => {
  render(
    <AlertDialog {...props}>
      <AlertDialogTrigger>Delete account</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this account?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>,
  )
  return onConfirm
}

describe('AlertDialog', () => {
  it('stays closed until the trigger is used', () => {
    renderAlertDialog()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('opens on the trigger, titled and described', async () => {
    renderAlertDialog()

    await userEvent.click(
      screen.getByRole('button', { name: 'Delete account' }),
    )

    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveAccessibleName('Delete this account?')
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.')
  })

  it('runs the action handler and closes on confirm', async () => {
    const onConfirm = renderAlertDialog({ defaultOpen: true })

    await userEvent.click(await screen.findByRole('button', { name: 'Delete' }))

    expect(onConfirm).toHaveBeenCalledOnce()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('closes on cancel without running the action', async () => {
    const onConfirm = renderAlertDialog({ defaultOpen: true })

    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })
})
