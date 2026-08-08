import { Link, Outlet } from 'react-router'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
          <span className="font-semibold">finance-app</span>
          <Link className="text-sm text-gray-600 hover:text-gray-900" to="/">
            Home
          </Link>
          <Link
            className="text-sm text-gray-600 hover:text-gray-900"
            to="/about"
          >
            About
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default App
