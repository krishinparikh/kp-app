import type { Meta, StoryObj } from '@storybook/react-vite'
import { Check, CircleDot } from 'lucide-react'
import { Badge } from './Badge.tsx'

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'ghost',
        'link',
      ],
    },
  },
  args: { children: 'Badge' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Failed' },
}

export const Outline: Story = { args: { variant: 'outline' } }

/** Every variant side by side, so contrast regressions are obvious. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Badge {...args}>Default</Badge>
      <Badge {...args} variant="secondary">
        Secondary
      </Badge>
      <Badge {...args} variant="destructive">
        Destructive
      </Badge>
      <Badge {...args} variant="outline">
        Outline
      </Badge>
      <Badge {...args} variant="ghost">
        Ghost
      </Badge>
    </div>
  ),
}

export const WithIcon: Story = {
  args: { children: undefined },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Badge {...args} variant="secondary">
        <CircleDot />
        In progress
      </Badge>
      <Badge {...args}>
        <Check />
        Done
      </Badge>
    </div>
  ),
}

/** `asChild` turns the badge into a link without losing its styling. */
export const AsLink: Story = {
  args: { asChild: true, variant: 'outline', children: undefined },
  render: (args) => (
    <Badge {...args}>
      <a href="https://example.com">v1.4.0</a>
    </Badge>
  ),
}
