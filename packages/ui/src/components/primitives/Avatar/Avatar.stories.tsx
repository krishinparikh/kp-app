import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from './Avatar.tsx'

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

const IMAGE = 'https://i.pravatar.cc/128?img=12'

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={IMAGE} alt="Ada Lovelace" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
}

/** The fallback is what shows while the image loads, or if it never does. */
export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="/does-not-exist.png" alt="Ada Lovelace" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Avatar {...args} key={size} size={size}>
          <AvatarImage src={IMAGE} alt="Ada Lovelace" />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

/** `AvatarBadge` pins a status dot to the corner. */
export const WithBadge: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={IMAGE} alt="Ada Lovelace" />
      <AvatarFallback>AL</AvatarFallback>
      <AvatarBadge className="bg-primary" />
    </Avatar>
  ),
}

/** Overlapping stack, with an overflow count at the end. */
export const Group: Story = {
  render: () => (
    <AvatarGroup>
      {['AL', 'GH', 'KP'].map((initials) => (
        <Avatar key={initials}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  ),
}
