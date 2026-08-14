import type { ComponentType } from 'react'
import { matchRoutes } from 'react-router'
import Home from './home/Page.tsx'
import About from './about/Page.tsx'

export type PageRoute = {
  /** URL pattern, passed straight to <Route path>. */
  path: string
  /** Document title, composed with the site name in App.tsx. */
  title: string
  /** Label in the header nav. Omit to keep a page out of the nav. */
  nav?: string
  Page: ComponentType
}

/**
 * The single source of truth for pages: the route tree, the nav, and document
 * titles all derive from this list. Adding a page is one entry plus its folder.
 */
export const pages: PageRoute[] = [
  { path: '/', title: 'Home', nav: 'Home', Page: Home },
  { path: '/about', title: 'About', nav: 'About', Page: About },
]

export const navPages = pages.filter((page) => page.nav)

// Carrying each page on its route object lets matchRoutes hand it back to us.
const matchable = pages.map((page) => ({ path: page.path, page }))

/**
 * Resolve the page for a pathname. Uses React Router's own ranking, so a static
 * segment beats a dynamic one (/accounts/new over /accounts/:id) whatever the
 * declaration order.
 */
export function findPage(pathname: string): PageRoute | undefined {
  return matchRoutes(matchable, pathname)?.at(-1)?.route.page
}
