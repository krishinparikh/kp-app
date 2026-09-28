import {
  Avatar,
  AvatarFallback,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@kp-app/ui'
import { initials } from '@/lib/utils.ts'

// Placeholder data. Swap for the accounts API once those endpoints exist.
const accounts = [
  { name: 'Everyday Checking', institution: 'Chase', balance: '$6,482.10' },
  { name: 'High-Yield Savings', institution: 'Ally', balance: '$21,900.00' },
  { name: 'Brokerage', institution: 'Fidelity', balance: '$57,340.55' },
  { name: 'Sapphire Card', institution: 'Chase', balance: '-$1,512.65' },
]

/** Every connected account and its current balance. */
export function AccountList() {
  return (
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
  )
}
