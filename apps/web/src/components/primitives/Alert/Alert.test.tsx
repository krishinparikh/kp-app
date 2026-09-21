import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Alert, AlertAction, AlertDescription, AlertTitle } from './Alert.tsx'

describe('Alert', () => {
  it('announces itself as an alert', () => {
    render(
      <Alert>
        <AlertTitle>Deploy failed</AlertTitle>
        <AlertDescription>Exit code 1.</AlertDescription>
      </Alert>,
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Deploy failed')
    expect(alert).toHaveTextContent('Exit code 1.')
  })

  it('renders an action alongside the message', () => {
    render(
      <Alert>
        <AlertTitle>Unsaved changes</AlertTitle>
        <AlertAction>
          <button type="button">Save</button>
        </AlertAction>
      </Alert>,
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeVisible()
  })

  it('merges a custom className instead of dropping it', () => {
    render(<Alert className="mb-4">Note</Alert>)
    expect(screen.getByRole('alert')).toHaveClass('mb-4')
  })
})
