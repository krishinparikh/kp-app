import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from './Avatar.tsx'

// Radix only swaps in AvatarImage once the image fires `load`, which jsdom
// never does — so the fallback is what these tests can see.
describe('Avatar', () => {
  it('shows the fallback while the image has not loaded', () => {
    render(
      <Avatar>
        <AvatarImage src="/avatar.png" alt="Ada Lovelace" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>,
    )

    expect(screen.getByText('AL')).toBeVisible()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('exposes the size as a data attribute', () => {
    render(
      <Avatar size="lg" data-testid="avatar">
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>,
    )

    expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', 'lg')
  })

  it('renders each avatar in a group', () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>GH</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    )

    expect(screen.getByText('AL')).toBeVisible()
    expect(screen.getByText('GH')).toBeVisible()
  })
})
