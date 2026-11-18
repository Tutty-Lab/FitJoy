export function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function streakOf(dates: string[], now = new Date()) {
  const days = new Set(dates)
  const cursor = new Date(now)
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (days.has(dayKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function experience(sessions: string[]) {
  return new Set(sessions.filter(key => /^(?:[1-9]|[1-8]\d|90):[1-3]$/.test(key))).size * 10
}
