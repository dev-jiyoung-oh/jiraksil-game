import { Routes, Route, Navigate } from 'react-router-dom';
import New from './New';
import Play from './Play';
import Manage from './Manage';

export default function WakeUpMissionRouter() {
  return (
    <Routes>
      <Route index element={<New />} />
      <Route path="new" element={<New />} />
      <Route path="play" element={<Play />} />
      <Route path="play/:gameCode" element={<Play />} />
      <Route path="manage" element={<Manage />} />
      <Route path="manage/:gameCode" element={<Manage />} />
      <Route path="*" element={<Navigate to="/game/wake-up-mission/new" replace />} />
    </Routes>
  );
}