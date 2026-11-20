import { Navigate, useParams } from 'react-router-dom'
export default function Celebration() {
  const day=Number(useParams().day)
  return <Navigate to={Number.isInteger(day)&&day>=1&&day<=90?`/days/${day}`:'/'} replace />
}
