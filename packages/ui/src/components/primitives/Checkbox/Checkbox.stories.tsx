import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '../Label/Label.tsx'
import { Checkbox } from './Checkbox.tsx'

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = { args: { defaultChecked: true } }

/** Three-state: `indeterminate` is the "some children selected" case. */
export const Indeterminate: Story = { args: { checked: 'indeterminate' } }

export const Disabled: Story = { args: { disabled: true } }

export const WithLabel: Story = {
  render: (args) => (
    <Label className="flex items-center gap-2">
      <Checkbox {...args} />
      Accept the terms
    </Label>
  ),
}

export const List: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {['Email', 'SMS', 'Push'].map((channel) => (
        <Label key={channel} className="flex items-center gap-2">
          <Checkbox {...args} defaultChecked={channel === 'Email'} />
          {channel}
        </Label>
      ))}
    </div>
  ),
}
