import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './Accordion.tsx'

const renderAccordion = (props = {}) =>
  render(
    <Accordion type="single" collapsible {...props}>
      <AccordionItem value="tokens">
        <AccordionTrigger>Tokens</AccordionTrigger>
        <AccordionContent>Two layers, one source.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="components">
        <AccordionTrigger>Components</AccordionTrigger>
        <AccordionContent>One folder each.</AccordionContent>
      </AccordionItem>
    </Accordion>,
  )

describe('Accordion', () => {
  it('starts with every section collapsed', () => {
    renderAccordion()

    expect(screen.getByRole('button', { name: 'Tokens' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(
      screen.queryByText('Two layers, one source.'),
    ).not.toBeInTheDocument()
  })

  it('expands a section when its trigger is clicked', async () => {
    renderAccordion()

    await userEvent.click(screen.getByRole('button', { name: 'Tokens' }))

    expect(await screen.findByText('Two layers, one source.')).toBeVisible()
  })

  it('collapses an open section again', async () => {
    renderAccordion({ defaultValue: 'tokens' })

    await userEvent.click(screen.getByRole('button', { name: 'Tokens' }))

    expect(screen.getByRole('button', { name: 'Tokens' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('closes the previous section in single mode', async () => {
    renderAccordion({ defaultValue: 'tokens' })

    await userEvent.click(screen.getByRole('button', { name: 'Components' }))

    expect(screen.getByRole('button', { name: 'Tokens' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.getByRole('button', { name: 'Components' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('keeps both sections open in multiple mode', async () => {
    renderAccordion({ type: 'multiple', defaultValue: ['tokens'] })

    await userEvent.click(screen.getByRole('button', { name: 'Components' }))

    expect(screen.getByRole('button', { name: 'Tokens' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Components' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})
