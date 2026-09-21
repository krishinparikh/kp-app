import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '../Label/Label.tsx'
import { RadioGroup, RadioGroupItem } from './RadioGroup.tsx'

const meta = {
  title: 'Primitives/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  args: { defaultValue: 'monthly' },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

const PLANS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'lifetime', label: 'Lifetime' },
]

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      {PLANS.map((plan) => (
        <Label key={plan.value} className="flex items-center gap-2">
          <RadioGroupItem value={plan.value} />
          {plan.label}
        </Label>
      ))}
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
}

/** A single option can opt out while the rest stay selectable. */
export const WithDisabledOption: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      {PLANS.map((plan) => (
        <Label key={plan.value} className="flex items-center gap-2">
          <RadioGroupItem
            value={plan.value}
            disabled={plan.value === 'lifetime'}
          />
          {plan.label}
        </Label>
      ))}
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: (args) => (
    <RadioGroup {...args} className="flex gap-4">
      {PLANS.map((plan) => (
        <Label key={plan.value} className="flex items-center gap-2">
          <RadioGroupItem value={plan.value} />
          {plan.label}
        </Label>
      ))}
    </RadioGroup>
  ),
}
