import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './Accordion.tsx'

// `type` splits Accordion's props into a discriminated union, which Storybook
// can't express as one args object. The meta pins the single-select shape; the
// other stories pass their own props in `render`.
type AccordionProps = Extract<
  ComponentProps<typeof Accordion>,
  { type: 'single' }
>

const meta = {
  title: 'Primitives/Accordion',
  component: Accordion,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { type: 'single', collapsible: true, defaultValue: 'tokens' },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<AccordionProps>

export default meta
type Story = StoryObj<typeof meta>

const SECTIONS = [
  {
    value: 'tokens',
    title: 'How do design tokens work?',
    body: 'Primitives hold raw values, semantics name the roles. Components only ever touch the semantic layer.',
  },
  {
    value: 'components',
    title: 'Where do components live?',
    body: 'One folder per component under src/components/primitives, each with a story and a test.',
  },
  {
    value: 'dark',
    title: 'How does dark mode switch?',
    body: 'A `.dark` ancestor class repoints every semantic token at a different primitive.',
  },
]

const items = SECTIONS.map((section) => (
  <AccordionItem key={section.value} value={section.value}>
    <AccordionTrigger>{section.title}</AccordionTrigger>
    <AccordionContent>{section.body}</AccordionContent>
  </AccordionItem>
))

/** One section open at a time — the default and the most common setup. */
export const Default: Story = {
  render: (args) => <Accordion {...args}>{items}</Accordion>,
}

/** `type="multiple"` lets several sections stay open together. */
export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['tokens', 'dark']}>
      {items}
    </Accordion>
  ),
}

/** Without `collapsible`, the open section can't be closed by clicking it. */
export const NotCollapsible: Story = {
  render: () => (
    <Accordion type="single" defaultValue="tokens">
      {items}
    </Accordion>
  ),
}
