import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../Checkbox/Checkbox.tsx'
import { Input } from '../Input/Input.tsx'
import { Label } from './Label.tsx'

const meta = {
  title: 'Primitives/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: 'Email' },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** `htmlFor` wires the label to the input, so clicking it focuses the field. */
export const WithInput: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-2">
      <Label {...args} htmlFor="story-email" />
      <Input id="story-email" type="email" placeholder="you@example.com" />
    </div>
  ),
}

/** Wrapping a control instead works too, and widens the click target. */
export const WrappingACheckbox: Story = {
  args: { children: undefined },
  render: (args) => (
    <Label {...args} className="flex items-center gap-2">
      <Checkbox />
      Remember me
    </Label>
  ),
}
