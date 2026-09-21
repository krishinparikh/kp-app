import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button/Button.tsx'
import { Input } from '../Input/Input.tsx'
import { Label } from '../Label/Label.tsx'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './Card.tsx'

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { size: { control: 'inline-radio', options: ['default', 'sm'] } },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Deploy to production</CardTitle>
        <CardDescription>
          This pushes the current main branch to the live environment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Last deploy was 3 hours ago by the CI pipeline.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
}

/** `CardAction` parks a control in the top-right of the header. */
export const WithAction: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Pro plan, renews monthly.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            Manage
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  ),
}

export const WithForm: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use your work email.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="card-email">Email</Label>
          <Input id="card-email" type="email" placeholder="you@example.com" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="card-password">Password</Label>
          <Input id="card-password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Sign in</Button>
      </CardFooter>
    </Card>
  ),
}

export const Small: Story = {
  args: { size: 'sm' },
  render: (args) => (
    <Card {...args} className="w-72">
      <CardHeader>
        <CardTitle>Compact</CardTitle>
        <CardDescription>Tighter padding throughout.</CardDescription>
      </CardHeader>
    </Card>
  ),
}
