import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kp-app/ui'

// Placeholder data. Swap for the transactions API once those endpoints exist.
const transactions = [
  {
    merchant: 'Blue Bottle',
    category: 'Coffee',
    date: 'Sep 22',
    amount: '-$6.40',
  },
  {
    merchant: 'Trader Joe’s',
    category: 'Groceries',
    date: 'Sep 21',
    amount: '-$78.15',
  },
  {
    merchant: 'Paycheck',
    category: 'Income',
    date: 'Sep 20',
    amount: '+$4,600.00',
  },
  {
    merchant: 'Con Edison',
    category: 'Utilities',
    date: 'Sep 19',
    amount: '-$112.90',
  },
  {
    merchant: 'Kindle Store',
    category: 'Books',
    date: 'Sep 18',
    amount: '-$14.99',
  },
]

/** The most recent transactions, as the overview's default tab. */
export function TransactionTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Your last five transactions.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.merchant}>
                <TableCell className="font-medium">
                  {transaction.merchant}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{transaction.category}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {transaction.date}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {transaction.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
