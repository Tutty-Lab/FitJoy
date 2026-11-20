import { playGameSound } from './lib/gameAudio'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './story.css'
import './adventure.css'
import './flow.css'
import './dark.css'
import { applyTheme } from './lib/theme'
import { apiEnabled } from './lib/api'
import { pullCatalog, pullUser } from './services/remote'

// Soft tap sound on the main game buttons, map stops and tab icons (respects the sound setting).
document.addEventListener('click', e => {
  if ((e.target as Element | null)?.closest?.('.game-primary, .game-secondary, .adventure-node, nav a, button.bg-brand-deep, a.bg-brand-deep, .rounded-2xl.border-mint')) playGameSound('tap')
}, { capture: true })

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
