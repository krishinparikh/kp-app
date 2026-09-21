import type { Meta, StoryObj } from '@storybook/react-vite'
import { Info, Plus } from 'lucide-react'
import { Button } from '../Button/Button.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip.tsx'

const meta = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  // The TooltipProvider every tooltip needs comes from .storybook/preview.tsx.
  // In the app it lives in main.tsx.
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Add item">
          <Plus />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Add item</TooltipContent>
    </Tooltip>
  ),
}

/** `side` picks the edge; the arrow follows automatically. */
export const Sides: Story = {
  render: () => (
    <div className="flex gap-2">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Opens on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
}

export const OnAnIcon: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger
        className="text-muted-foreground"
        aria-label="What is this?"
      >
        <Info className="size-4" />
      </TooltipTrigger>
      <TooltipContent>
        Semantic tokens only — raw colors fail the lint.
      </TooltipContent>
    </Tooltip>
  ),
}
