import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import TriviaPage from "./pages/TriviaPage.jsx";
import WaitingRoomPage from "./pages/WaitingRoomPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/trivia" element={<TriviaPage />} />
      <Route path="/rooms/:code" element={<WaitingRoomPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
