import { Routes, Route, Navigate } from 'react-router-dom'
import New from './New'
import Cards from './Cards'
import Manage from './Manage'

export default function WakeUpMissionRouter() {
  return (
    <Routes>
      <Route index element={<New />} />
      <Route path="new" element={<New />} />
      <Route path=":gameId" element={<Cards />} />
      <Route path=":gameId/manage" element={<Manage />} />
      <Route path="*" element={<Navigate to="/new" replace />} />
    </Routes>
  )
}