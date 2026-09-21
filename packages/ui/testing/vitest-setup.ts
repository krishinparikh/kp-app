import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// jsdom is shared across tests in a file; unmount between them.
afterEach(cleanup)

// Radix primitives (Select, Dialog, DropdownMenu, …) call browser APIs jsdom
// doesn't implement. Without these stubs the overlays throw on open.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Element.prototype.scrollIntoView ??= vi.fn()
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.setPointerCapture ??= vi.fn()
Element.prototype.releasePointerCapture ??= vi.fn()

window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList
