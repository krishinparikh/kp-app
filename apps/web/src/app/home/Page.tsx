import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@kp-app/ui'

// Placeholder data. Swap for the users/accounts API once those endpoints exist.
const stats = [
  { label: 'Net worth', value: '$84,210', change: '+2.4%', up: true },
  { label: 'Spent this month', value: '$3,178', change: '+11.6%', up: false },
  { label: 'Saved this month', value: '$1,420', change: '+4.1%', up: true },
  { label: 'Savings rate', value: '31%', change: '-1.2%', up: false },
]

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

const accounts = [
  { name: 'Everyday Checking', institution: 'Chase', balance: '$6,482.10' },
  { name: 'High-Yield Savings', institution: 'Ally', balance: '$21,900.00' },
  { name: 'Brokerage', institution: 'Fidelity', balance: '$57,340.55' },
  { name: 'Sapphire Card', institution: 'Chase', balance: '-$1,512.65' },
]

const budgets = [
  { label: 'Groceries', spent: 412, limit: 600 },
  { label: 'Dining out', spent: 288, limit: 300 },
  { label: 'Transport', spent: 96, limit: 250 },
  { label: 'Subscriptions', spent: 64, limit: 80 },
]

/** Two initials for the avatar, from the first two words of a name. */
function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
}

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            September 2026 · 4 accounts connected
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Add transaction</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
              <CardAction>
                <Badge variant={stat.up ? 'secondary' : 'destructive'}>
                  {stat.change}
                </Badge>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
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
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
              <CardDescription>Balances as of this morning.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {accounts.map((account, index) => (
                <div key={account.name}>
                  {index > 0 && <Separator className="my-1" />}
                  <div className="flex items-center gap-3 py-2">
                    <Avatar>
                      <AvatarFallback>{initials(account.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {account.institution}
                      </p>
                    </div>
                    <p className="text-sm font-medium">{account.balance}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets">
          <Card>
            <CardHeader>
              <CardTitle>Budgets</CardTitle>
              <CardDescription>How September is tracking.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {budgets.map((budget) => {
                const percent = Math.min(
                  100,
                  Math.round((budget.spent / budget.limit) * 100),
                )
                return (
                  <div key={budget.label} className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium">
                        {budget.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ${budget.spent} of ${budget.limit}
                      </span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-label={budget.label}
                      aria-valuenow={percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className={
                          percent >= 90
                            ? 'h-full bg-destructive'
                            : 'h-full bg-primary'
                        }
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
