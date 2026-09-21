import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '../Label/Label.tsx'
import { Input } from './Input.tsx'

const meta = {
  title: 'Primitives/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'file'],
    },
    disabled: { control: 'boolean' },
  },
  args: { placeholder: 'you@example.com' },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The usual pairing — a `Label` whose `htmlFor` matches the input `id`. */
export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input {...args} id="email" type="email" />
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, value: 'Locked' } }

/** `aria-invalid` is what drives the error ring — no separate prop. */
export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'not-an-email' },
}

export const Password: Story = {
  args: { type: 'password', placeholder: 'Password' },
}

export const File: Story = { args: { type: 'file', placeholder: undefined } }
