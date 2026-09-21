import type { Meta, StoryObj } from '@storybook/react-vite'
import { CircleAlert, Info, TriangleAlert } from 'lucide-react'
import { Button } from '../Button/Button.tsx'
import { Alert, AlertAction, AlertDescription, AlertTitle } from './Alert.tsx'

const meta = {
  title: 'Primitives/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'destructive'] },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <Info />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        Your trial ends in 5 days. Add a payment method to keep going.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  args: { variant: 'destructive' },
  render: (args) => (
    <Alert {...args}>
      <CircleAlert />
      <AlertTitle>Deploy failed</AlertTitle>
      <AlertDescription>
        The build step exited with code 1. Check the CI logs for details.
      </AlertDescription>
    </Alert>
  ),
}

/** The icon is optional — drop it and the text fills the width. */
export const WithoutIcon: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Maintenance window</AlertTitle>
      <AlertDescription>Saturday 02:00–04:00 UTC.</AlertDescription>
    </Alert>
  ),
}

/** `AlertAction` parks a control in the top-right corner. */
export const WithAction: Story = {
  render: (args) => (
    <Alert {...args}>
      <TriangleAlert />
      <AlertTitle>Unsaved changes</AlertTitle>
      <AlertDescription>
        You have edits that are not committed.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline">
          Save
        </Button>
      </AlertAction>
    </Alert>
  ),
}
