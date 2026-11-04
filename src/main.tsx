import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './dark.css'
import { applyTheme } from './lib/theme'
import { apiEnabled } from './lib/api'
import { pullCatalog, pullUser } from './services/remote'

async function boot() {
  // Refresh the local cache from the API before any screen reads it (workouts and progress
  // read their caches when their modules load, so App is imported only afterwards).
  if (apiEnabled) await Promise.allSettled([pullUser(), pullCatalog()])
  applyTheme()
  const { default: App } = await import('./App')
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}

boot()
