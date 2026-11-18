import { Capacitor, registerPlugin } from '@capacitor/core'
import { dayKey } from './game'
import { lang } from './i18n'

const widget = registerPlugin<{ getLaunchRoute(): Promise<{ route?: string }>; update(options: { dates: string[]; language: string; signedIn: boolean; today: string }): Promise<void> }>('StreakWidget')
let pending = Promise.resolve()
export function syncWidget(dates: string[], signedIn: boolean) {
  if (!Capacitor.isNativePlatform()) return
  // Serialize updates so a delayed completion cannot overwrite sign-out.
  pending = pending.catch(() => {}).then(() => widget.update({ dates: signedIn ? dates : [], signedIn, language: lang, today: dayKey(new Date()) })).catch(error => console.warn('Widget update unavailable', error))
}

export async function widgetLaunchRoute() {
  if (!Capacitor.isNativePlatform()) return undefined
  try { return (await widget.getLaunchRoute()).route } catch { return undefined }
}
