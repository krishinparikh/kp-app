import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kp-app/ui'

// Placeholder data. Swap for the budgets API once those endpoints exist.
const budgets = [
  { label: 'Groceries', spent: 412, limit: 600 },
  { label: 'Dining out', spent: 288, limit: 300 },
  { label: 'Transport', spent: 96, limit: 250 },
  { label: 'Subscriptions', spent: 64, limit: 80 },
]

/** Spend against limit for each budget, one bar per category. */
export function BudgetList() {
  return (
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
                <span className="text-sm font-medium">{budget.label}</span>
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
  )
}
