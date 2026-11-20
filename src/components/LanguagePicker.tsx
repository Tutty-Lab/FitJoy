import { L, lang, setLang } from '../lib/i18n'

export default function LanguagePicker({ compact = false }: { compact?: boolean }) {
  return <label className="flex items-center justify-between gap-3 text-sm font-semibold">
    {!compact && L('Sprache', 'Ngôn ngữ')}
    <select aria-label={L('Sprache', 'Ngôn ngữ')} value={lang} onChange={e=>setLang(e.target.value as 'de'|'vi')} className="rounded-xl border border-mint bg-white px-3 py-2">
      <option value="de">Deutsch</option><option value="vi">Tiếng Việt</option>
    </select>
  </label>
}
