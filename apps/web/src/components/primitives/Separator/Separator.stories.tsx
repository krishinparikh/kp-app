import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from './Separator.tsx'

const meta = {
  title: 'Primitives/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    decorative: { control: 'boolean' },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-64">
      <p className="text-sm font-medium">Design tokens</p>
      <p className="text-sm text-muted-foreground">Two layers, one source.</p>
      <Separator {...args} className="my-4" />
      <p className="text-sm text-muted-foreground">
        Everything below the line.
      </p>
    </div>
  ),
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="flex h-6 items-center gap-4 text-sm">
      <span>Docs</span>
      <Separator {...args} />
      <span>Source</span>
      <Separator {...args} />
      <span>Storybook</span>
    </div>
  ),
}

/**
 * Decorative by default, so screen readers skip it. Set `decorative={false}`
 * when the rule genuinely divides two sections of content.
 */
export const Semantic: Story = {
  args: { decorative: false },
  render: (args) => (
    <div className="w-64">
      <Separator {...args} />
    </div>
  ),
}
