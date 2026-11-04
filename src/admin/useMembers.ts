import { useEffect, useState } from 'react'
import { fetchMembers, type Member } from '../services/adminApi'

export function useMembers() {
  const [members, setMembers] = useState<Member[] | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    fetchMembers()
      .then(setMembers)
      .catch(e => setError(e instanceof Error ? e.message : 'Could not load members'))
  }, [])
  return { members, error }
}
