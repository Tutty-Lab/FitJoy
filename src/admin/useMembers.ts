import { useCallback, useEffect, useState } from 'react'
import { fetchMembers, type Member } from '../services/adminApi'

export function useMembers() {
  const [members, setMembers] = useState<Member[] | null>(null)
  const [error, setError] = useState('')
  const refresh = useCallback(async () => {
    try { setMembers(await fetchMembers()); setError('') }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load members') }
  }, [])
  useEffect(() => { void refresh() }, [refresh])
  return { members, error, refresh }
}
