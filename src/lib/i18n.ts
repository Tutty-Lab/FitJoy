// Tiny two-language layer: German (default, the customer's language) and Vietnamese.
// Strings sit next to their usage as L('Deutsch', 'Tiếng Việt'); switching language reloads the app.
export type Lang = 'de' | 'vi'
const KEY = 'fitjoy.lang'

export const lang: Lang = (() => {
  try { return localStorage.getItem(KEY) === 'vi' ? 'vi' : 'de' } catch { return 'de' }
})()
if (typeof document !== 'undefined') document.documentElement.lang = lang

export const L = (de: string, vi: string) => (lang === 'vi' ? vi : de)
export const locale = lang === 'vi' ? 'vi-VN' : 'de-DE'

export function setLang(next: Lang) {
  try { localStorage.setItem(KEY, next) } catch { /* ignore */ }
  location.reload()
}
