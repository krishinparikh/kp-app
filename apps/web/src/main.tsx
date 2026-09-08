import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import App from './App.tsx'
import { pages } from './app/routes.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          {pages.map(({ path, Page }) => (
            <Route key={path} path={path} element={<Page />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
