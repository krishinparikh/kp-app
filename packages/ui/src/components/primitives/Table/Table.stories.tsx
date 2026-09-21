import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../Badge/Badge.tsx'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './Table.tsx'

const meta = {
  title: 'Primitives/Table',
  component: Table,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[36rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const INVOICES = [
  { id: 'INV-001', status: 'Paid', method: 'Card', amount: '$250.00' },
  { id: 'INV-002', status: 'Pending', method: 'Transfer', amount: '$150.00' },
  { id: 'INV-003', status: 'Unpaid', method: 'Card', amount: '$350.00' },
]

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Invoices from the last quarter.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICES.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>
              <Badge
                variant={invoice.status === 'Paid' ? 'secondary' : 'outline'}
              >
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

/** `data-state="selected"` is what highlights a row. */
export const WithSelectedRow: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICES.map((invoice, index) => (
          <TableRow
            key={invoice.id}
            data-state={index === 1 ? 'selected' : undefined}
          >
            <TableCell>{invoice.id}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
