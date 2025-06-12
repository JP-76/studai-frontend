import { useEffect, useState } from 'react';
import { getAllQuizzes } from '../api/QuizService';
import type { QuizDTO } from '../types/Quiz';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';

export const QuizList = () => {
  const [quizzes, setQuizzes] = useState<QuizDTO[]>([]);

  useEffect(() => {
    getAllQuizzes().then(setQuizzes);
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Quizzes Disponíveis</h1>
      {quizzes.length === 0 ? (
        <p className="text-gray-500">Nenhum quiz encontrado.</p>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardContent className="p-4">
                <Link to={`/quiz/${quiz.id}`}>
                  <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                    {quiz.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-700">{quiz.description}</p>
                <div className="text-xs text-gray-500 mt-2">
                  <span>Idioma: {quiz.languageCode === "PT" ? "Português" : "Inglês"}</span> |{" "}
                  <span>Fonte: {quiz.sourceType.replace(/_/g, " ").toLowerCase()}</span> |{" "}
                  <span>{quiz.questions.length} pergunta(s)</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
