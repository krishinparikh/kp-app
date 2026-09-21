import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './Card.tsx'

describe('Card', () => {
  it('renders every section it is given', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Pro plan</CardDescription>
          <CardAction>
            <button type="button">Manage</button>
          </CardAction>
        </CardHeader>
        <CardContent>Renews monthly</CardContent>
        <CardFooter>Updated today</CardFooter>
      </Card>,
    )

    expect(screen.getByText('Billing')).toBeVisible()
    expect(screen.getByText('Pro plan')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Manage' })).toBeVisible()
    expect(screen.getByText('Renews monthly')).toBeVisible()
    expect(screen.getByText('Updated today')).toBeVisible()
  })

  it('exposes the size as a data attribute', () => {
    render(
      <Card size="sm" data-testid="card">
        Compact
      </Card>,
    )

    expect(screen.getByTestId('card')).toHaveAttribute('data-size', 'sm')
  })

  it('merges a custom className instead of dropping it', () => {
    render(<Card data-testid="card" className="w-80" />)
    expect(screen.getByTestId('card')).toHaveClass('w-80')
  })
})
