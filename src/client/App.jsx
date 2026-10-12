import { Navigate, Route, Routes } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage.jsx";
import TriviaPage from "./pages/TriviaPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LobbyPage />} />
      <Route path="/trivia" element={<TriviaPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
