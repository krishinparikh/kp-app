import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './Skeleton.tsx'

const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

/** Size and shape come from classes — the component itself has none. */
export const Default: Story = { args: { className: 'h-4 w-48' } }

export const Circle: Story = { args: { className: 'size-10 rounded-full' } }

/** The real use: mirror the layout of whatever is still loading. */
export const CardPlaceholder: Story = {
  render: () => (
    <div className="flex w-72 items-center gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  ),
}
