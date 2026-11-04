import { loadProfile } from './profile'

// Toggles the `dark` class on <html>; colours are remapped in src/dark.css.
export function applyTheme(dark = loadProfile()?.darkMode ?? false) {
  document.documentElement.classList.toggle('dark', dark)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0e1512' : '#1a8a99')
}
