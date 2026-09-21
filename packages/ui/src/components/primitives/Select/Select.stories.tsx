import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '../Label/Label.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select.tsx'

const meta = {
  title: 'Primitives/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Pick an environment" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="development">Development</SelectItem>
        <SelectItem value="staging">Staging</SelectItem>
        <SelectItem value="production">Production</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex w-56 flex-col gap-2">
      <Label htmlFor="story-env">Environment</Label>
      <Select {...args}>
        <SelectTrigger id="story-env">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="development">Development</SelectItem>
          <SelectItem value="production">Production</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

/** Groups get a heading; a separator splits unrelated sets. */
export const Grouped: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Pick a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="pst">Pacific</SelectItem>
          <SelectItem value="est">Eastern</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean</SelectItem>
          <SelectItem value="cet">Central European</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Small: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger size="sm" className="w-56">
        <SelectValue placeholder="Pick an environment" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="development">Development</SelectItem>
        <SelectItem value="production">Production</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
}
