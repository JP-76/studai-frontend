import { Link } from "react-router-dom";

const TestMenu = () => {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Menu de Testes</h1>
      <ul className="space-y-2">
        <li><Link to="/auth" className="text-blue-600 underline">Tela de Login</Link></li>
        <li><Link to="/create-quiz" className="text-blue-600 underline">Criar Quiz</Link></li>
        <li><Link to="/quizzes" className="text-blue-600 underline">Lista de Quizzes</Link></li>
        <li><Link to="/quiz/1" className="text-blue-600 underline">QuizPage (quizId=1)</Link></li>
      </ul>
    </div>
  );
};

export default TestMenu;
