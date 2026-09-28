import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs.tsx'

const renderTabs = (props = {}) =>
  render(
    <Tabs defaultValue="overview" {...props}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">What the service does.</TabsContent>
      <TabsContent value="metrics">Requests, latency, errors.</TabsContent>
    </Tabs>,
  )

describe('Tabs', () => {
  it('renders a tab per trigger', () => {
    renderTabs()
    expect(screen.getAllByRole('tab')).toHaveLength(2)
  })

  it('shows only the default panel', () => {
    renderTabs()

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByText('What the service does.')).toBeVisible()
    expect(
      screen.queryByText('Requests, latency, errors.'),
    ).not.toBeInTheDocument()
  })

  it('swaps the panel when another tab is clicked', async () => {
    renderTabs()

    await userEvent.click(screen.getByRole('tab', { name: 'Metrics' }))

    expect(await screen.findByText('Requests, latency, errors.')).toBeVisible()
    expect(screen.queryByText('What the service does.')).not.toBeInTheDocument()
  })

  it('moves between tabs with the arrow keys', async () => {
    renderTabs()

    await userEvent.click(screen.getByRole('tab', { name: 'Overview' }))
    await userEvent.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'Metrics' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('exposes the list variant as a data attribute', () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList variant="line" data-testid="list">
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
      </Tabs>,
    )

    expect(screen.getByTestId('list')).toHaveAttribute('data-variant', 'line')
  })
})
