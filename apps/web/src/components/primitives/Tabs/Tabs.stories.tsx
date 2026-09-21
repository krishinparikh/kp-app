import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs.tsx'

const meta = {
  title: 'Primitives/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
  args: { defaultValue: 'overview' },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const PANELS = [
  { value: 'overview', label: 'Overview', body: 'What the service does.' },
  { value: 'metrics', label: 'Metrics', body: 'Requests, latency, errors.' },
  { value: 'logs', label: 'Logs', body: 'The last hour of output.' },
]

export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        {PANELS.map((panel) => (
          <TabsTrigger key={panel.value} value={panel.value}>
            {panel.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {PANELS.map((panel) => (
        <TabsContent key={panel.value} value={panel.value}>
          {panel.body}
        </TabsContent>
      ))}
    </Tabs>
  ),
}

/** The `line` variant drops the filled pill for an underline. */
export const Line: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList variant="line">
        {PANELS.map((panel) => (
          <TabsTrigger key={panel.value} value={panel.value}>
            {panel.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {PANELS.map((panel) => (
        <TabsContent key={panel.value} value={panel.value}>
          {panel.body}
        </TabsContent>
      ))}
    </Tabs>
  ),
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: Default.render,
}

export const WithDisabledTab: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        {PANELS.map((panel) => (
          <TabsTrigger
            key={panel.value}
            value={panel.value}
            disabled={panel.value === 'logs'}
          >
            {panel.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {PANELS.map((panel) => (
        <TabsContent key={panel.value} value={panel.value}>
          {panel.body}
        </TabsContent>
      ))}
    </Tabs>
  ),
}
