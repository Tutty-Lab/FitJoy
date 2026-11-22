// FitJoy cartoon icon set (see .claude/skills/cartoon-ui): flat palette fills, one gloss highlight, soft ground shadow.

export function IcoGem({ size = 22 }: { size?: number }) {
  return <svg viewBox="0 0 24 22" width={size} height={size * 22 / 24} aria-hidden="true" className="ico-inline">
    <path d="M5 2h14l4 5-11 13L1 7z" fill="#5fd3ff" stroke="#0b4a54" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M5 2h14l-3 5H8z" fill="#b5ecff" />
    <path d="M1 7h22M8 7l4 13 4-13" fill="none" stroke="#0b4a54" strokeWidth="1.2" strokeLinejoin="round" opacity=".5" />
    <path d="M6 4.5l2 2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
}

export function IcoTrain({ size = 44 }: { size?: number }) {
  // Vestibu-style balance pose: a sneaker on a soft balance pad.
  return <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
    <ellipse cx="24" cy="42" rx="16" ry="3" fill="#0b4a54" opacity=".18" />
    <ellipse cx="24" cy="36" rx="18" ry="6" fill="#32b49a" />
    <ellipse cx="24" cy="34" rx="18" ry="6" fill="#7fe0c8" />
    <path d="M12 30c0-6 3-12 9-13l3 6c2 2 6 3 10 3 3 0 4 2 3 4z" fill="#ff7a59" />
    <path d="M12 30h25" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    <path d="M19 20l3 4M22 18l3 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".8" />
    <path d="M15 24c1-3 3-5 5-6" stroke="#ffd3c2" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
}

export function IcoGift({ size = 30 }: { size?: number }) {
  return <svg viewBox="0 0 36 36" width={size} height={size} aria-hidden="true">
    <rect x="5" y="15" width="26" height="17" rx="4" fill="#ff7a59" />
    <rect x="3" y="10" width="30" height="8" rx="3" fill="#ff9a7f" />
    <rect x="15.5" y="10" width="5" height="22" fill="#ffd23f" />
    <path d="M18 10c-3-6-10-6-9-1 1 3 6 2 9 1zM18 10c3-6 10-6 9-1-1 3-6 2-9 1z" fill="#ffd23f" />
    <path d="M7 13h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".7" />
  </svg>
}

export function IcoLock({ size = 26 }: { size?: number }) {
  return <svg viewBox="0 0 30 32" width={size} height={size * 32 / 30} aria-hidden="true">
    <path d="M9 14V10a6 6 0 0 1 12 0v4" fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
    <rect x="4" y="13" width="22" height="17" rx="5" fill="#cbd5e1" />
    <circle cx="15" cy="21" r="2.5" fill="#64748b" /><rect x="14" y="22" width="2" height="4" rx="1" fill="#64748b" />
    <path d="M8 17h5" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".8" />
  </svg>
}
