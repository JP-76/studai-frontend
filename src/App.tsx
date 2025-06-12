import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import { QuizList } from "./pages/QuizList";
import QuizPage from "./pages/QuizPage";
import TestMenu from "./pages/TestMenu";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestMenu />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/create-quiz" element={<CreateQuizPage />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;
