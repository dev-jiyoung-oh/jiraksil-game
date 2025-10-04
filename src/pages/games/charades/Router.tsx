import { Routes, Route, Navigate } from 'react-router-dom';
import New from './New';
import Snapshot from './Snapshot';
import Manage from './Manage';

// 몸으로 말해요(CHARADES) 라우터
export default function CharadesRouter() {
  return (
    <Routes>
      <Route index element={<New />} />
      <Route path="new" element={<New />} />
      <Route path=":gameCode" element={<Snapshot />} />
      <Route path=":gameCode/manage" element={<Manage />} />
      <Route path="*" element={<Navigate to="/new" replace />} />
    </Routes>
  );
}
