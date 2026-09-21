import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '../Label/Label.tsx'
import { Textarea } from './Textarea.tsx'

const meta = {
  title: 'Primitives/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' }, rows: { control: 'number' } },
  args: { placeholder: 'Tell us what happened…' },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="story-notes">Notes</Label>
      <Textarea {...args} id="story-notes" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Read only' },
}

export const Invalid: Story = { args: { 'aria-invalid': true } }

/** `rows` still works; the component only sets a minimum height. */
export const Tall: Story = { args: { rows: 8 } }
