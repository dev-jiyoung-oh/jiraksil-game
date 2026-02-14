import { Routes, Route } from "react-router-dom";
import ToastProvider from "@/components/common/toast/ToastProvider";
import AuthProvider from "@/components/common/auth/AuthProvider";
import Header from "@/components/common/Header";
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import WakeUpMissionRouter from '@/pages/games/wake-up-mission/Router';
import CharadesRouter from '@/pages/games/charades/Router';
import './App.css';

function App() {

  return (
    <ToastProvider>
      <AuthProvider>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/game" element={<Home />} />
          <Route path="/game/wake-up-mission/*" element={<WakeUpMissionRouter />} />
          <Route path="/game/charades/*" element={<CharadesRouter />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
