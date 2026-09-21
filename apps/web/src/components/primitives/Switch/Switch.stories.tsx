import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '../Label/Label.tsx'
import { Switch } from './Switch.tsx'

const meta = {
  title: 'Primitives/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = { args: { defaultChecked: true } }

export const Disabled: Story = { args: { disabled: true } }

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch {...args} size="sm" aria-label="Small" />
      <Switch {...args} size="default" aria-label="Default" />
    </div>
  ),
}

/** The common settings-row shape: label on the left, switch on the right. */
export const SettingsRow: Story = {
  render: (args) => (
    <div className="flex w-72 items-center justify-between">
      <div className="flex flex-col">
        <Label htmlFor="story-notifications">Email notifications</Label>
        <span className="text-xs text-muted-foreground">
          One digest per week.
        </span>
      </div>
      <Switch {...args} id="story-notifications" />
    </div>
  ),
}
