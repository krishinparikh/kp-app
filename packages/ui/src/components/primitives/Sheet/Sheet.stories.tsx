import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button/Button.tsx'
import { Input } from '../Input/Input.tsx'
import { Label } from '../Label/Label.tsx'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './Sheet.tsx'

const meta = {
  title: 'Primitives/Sheet',
  component: Sheet,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

/** A dialog that slides in from an edge. Same parts, different entrance. */
export const Default: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="outline">Open settings</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Applies to this workspace only.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sheet-name">Workspace name</Label>
            <Input id="sheet-name" defaultValue="kp-app" />
          </div>
        </div>
        <SheetFooter>
          <Button>Save</Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

/** Each edge, so the slide-in animation can be checked in all four. */
export const Sides: Story = {
  render: () => (
    <div className="flex gap-2">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              {side}
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>From the {side}</SheetTitle>
              <SheetDescription>
                `side` picks the edge it enters from.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
}

export const Open: Story = {
  args: { defaultOpen: true },
  render: Default.render,
}
