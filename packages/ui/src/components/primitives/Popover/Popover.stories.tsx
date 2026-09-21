import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button/Button.tsx'
import { Input } from '../Input/Input.tsx'
import { Label } from '../Label/Label.tsx'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './Popover.tsx'

const meta = {
  title: 'Primitives/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="outline">Dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the size of the layer.</PopoverDescription>
        </PopoverHeader>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="popover-width">Width</Label>
            <Input
              id="popover-width"
              defaultValue="100%"
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="popover-height">Height</Label>
            <Input
              id="popover-height"
              defaultValue="24px"
              className="col-span-2"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

/** `align` and `side` control where it lands relative to the trigger. */
export const Aligned: Story = {
  render: () => (
    <div className="flex gap-2">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Popover key={align}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {align}
            </Button>
          </PopoverTrigger>
          <PopoverContent align={align} className="w-48">
            <PopoverTitle>Aligned {align}</PopoverTitle>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}

export const Open: Story = {
  args: { defaultOpen: true },
  render: Default.render,
}
