import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRight, Trash2 } from 'lucide-react'
import { Button } from './Button.tsx'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'outline',
        'secondary',
        'ghost',
        'destructive',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: [
        'xs',
        'sm',
        'default',
        'lg',
        'icon-xs',
        'icon-sm',
        'icon',
        'icon-lg',
      ],
    },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Button' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Outline: Story = { args: { variant: 'outline' } }

export const Ghost: Story = { args: { variant: 'ghost' } }

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete account' },
}

export const Link: Story = { args: { variant: 'link' } }

/** Every size side by side, so spacing regressions are obvious. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="xs">
        Extra small
      </Button>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="default">
        Default
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
}

export const WithIcon: Story = {
  args: { children: undefined },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args}>
        Continue
        <ArrowRight data-icon="inline-end" />
      </Button>
      <Button {...args} variant="destructive" size="icon" aria-label="Delete">
        <Trash2 />
      </Button>
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }

/** `asChild` hands the styling to whatever element you nest — a link here. */
export const AsChild: Story = {
  args: { asChild: true, children: undefined },
  render: (args) => (
    <Button {...args}>
      <a href="https://example.com">A styled anchor</a>
    </Button>
  ),
}
