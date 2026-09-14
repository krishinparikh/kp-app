export default function Home() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Home</h1>
      <p className="mt-2 text-muted-foreground">
        Edit{' '}
        <code className="rounded-sm bg-muted px-1">src/app/home/Page.tsx</code>{' '}
        and save to test HMR. Register new pages in{' '}
        <code className="rounded-sm bg-muted px-1">src/app/routes.ts</code>.
      </p>
    </section>
  )
}
