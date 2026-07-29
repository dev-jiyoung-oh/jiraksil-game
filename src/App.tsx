import { Routes, Route } from "react-router-dom";
import ToastProvider from "@/components/common/toast/ToastProvider";
import AuthProvider from "@/components/common/auth/AuthProvider";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import WakeUpMissionRouter from '@/pages/games/wake-up-mission/Router';
import CharadesRouter from '@/pages/games/charades/Router';
import MyPage from '@/pages/MyPage';
import './App.css';

function App() {

  return (
    <ToastProvider>
      <AuthProvider>
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
        </main>

        <Footer />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
