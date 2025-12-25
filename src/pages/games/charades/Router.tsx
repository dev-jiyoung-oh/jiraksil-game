import { Routes, Route, Navigate } from 'react-router-dom';
import New from './New';
import Play from './Play';
import Manage from './Manage';
import Update from './Update';

// 몸으로 말해요(CHARADES) 라우터
export default function CharadesRouter() {
  return (
    <Routes>
      <Route index element={<New />} />
      <Route path="new" element={<New />} />
      <Route path="play" element={<Play />} />
      <Route path="play/:gameCode" element={<Play />} />
      <Route path="manage" element={<Manage />} />
      <Route path="manage/:gameCode" element={<Manage />} />
      <Route path="update" element={<Update />} />
      <Route path="update/:gameCode" element={<Update />} />
      <Route path="*" element={<Navigate to="/game/charades/new" replace />} />
    </Routes>
  );
}
