import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@kp-app/ui'
import { AccountList } from './components/AccountList.tsx'
import { BudgetList } from './components/BudgetList.tsx'
import { People } from './components/People.tsx'
import { StatCards } from './components/StatCards.tsx'
import { TransactionTable } from './components/TransactionTable.tsx'

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

      <StatCards />

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <TransactionTable />
        </TabsContent>

        <TabsContent value="accounts">
          <AccountList />
        </TabsContent>

        <TabsContent value="budgets">
          <BudgetList />
        </TabsContent>

        <TabsContent value="people">
          <People />
        </TabsContent>
      </Tabs>
    </div>
  )
}
