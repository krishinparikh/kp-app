import {
  Badge,
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kp-app/ui'

// Placeholder data. Swap for the accounts API once those endpoints exist.
const stats = [
  { label: 'Net worth', value: '$84,210', change: '+2.4%', up: true },
  { label: 'Spent this month', value: '$3,178', change: '+11.6%', up: false },
  { label: 'Saved this month', value: '$1,420', change: '+4.1%', up: true },
  { label: 'Savings rate', value: '31%', change: '-1.2%', up: false },
]

/** The four headline numbers across the top of the overview. */
export function StatCards() {
  return (
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
  )
}
