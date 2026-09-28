import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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

const renderTable = () =>
  render(
    <Table>
      <TableCaption>Recent invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV-001</TableCell>
          <TableCell>$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>INV-002</TableCell>
          <TableCell>$150.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>$400.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>,
  )

describe('Table', () => {
  it('renders a table with its caption', () => {
    renderTable()
    expect(screen.getByRole('table', { name: 'Recent invoices' })).toBeVisible()
  })

  it('renders the column headers', () => {
    renderTable()

    const headers = screen.getAllByRole('columnheader')
    expect(headers.map((header) => header.textContent)).toEqual([
      'Invoice',
      'Amount',
    ])
  })

  it('renders a row per record, plus header and footer', () => {
    renderTable()
    expect(screen.getAllByRole('row')).toHaveLength(4)
  })

  it('puts the cell values in the right row', () => {
    renderTable()

    const row = screen.getByRole('row', { name: /INV-002/ })
    expect(within(row).getByText('$150.00')).toBeVisible()
  })
})
