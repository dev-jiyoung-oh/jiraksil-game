import { Routes, Route, useLocation } from "react-router-dom";
import ToastProvider from "@/components/common/toast/ToastProvider";
import AuthProvider from "@/components/common/auth/AuthProvider";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FullscreenButton from "@/components/common/FullscreenButton";
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import WakeUpMissionRouter from '@/pages/games/wake-up-mission/Router';
import CharadesRouter from '@/pages/games/charades/Router';
import MyPage from '@/pages/MyPage';
import './App.css';

function AppContent() {
  const { pathname } = useLocation();
  const isPlayPage = pathname.includes("/play");

  return (
    <>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/game" element={<Home />} />
          <Route path="/game/wake-up-mission/*" element={<WakeUpMissionRouter />} />
          <Route path="/game/charades/*" element={<CharadesRouter />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
        {isPlayPage && <FullscreenButton />}
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
