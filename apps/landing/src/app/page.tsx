import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@kp-app/ui'

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-semibold">KP App</h1>
        <Badge variant="secondary">Landing</Badge>
      </div>

      <p className="text-muted-foreground">
        Every color, radius and font on this page comes from{' '}
        <code className="rounded-md bg-muted px-1.5 py-0.5 text-sm">
          @kp-app/ui
        </code>
        . Nothing is declared here.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Shared with the web app</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </CardContent>
      </Card>
    </main>
  )
}
