import { Link, Outlet, useLocation } from 'react-router'
import { site } from './lib/site.ts'
import { findPage, navPages } from './app/routes.ts'

function App() {
  const { pathname } = useLocation()
  const page = findPage(pathname)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* React 19 hoists these into <head>. */}
      <title>{page ? `${page.title} · ${site.name}` : site.name}</title>
      <meta name="description" content={site.description} />
      <header className="border-b border-border bg-card">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
          <span className="font-semibold">{site.name}</span>
          {navPages.map(({ path, nav }) => (
            <Link
              key={path}
              className="text-sm text-muted-foreground hover:text-foreground"
              to={path}
            >
              {nav}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default App
