// src/pages/UserQuizzesPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Quiz } from "../types/quiz";
import { FaSpinner } from "react-icons/fa";
import api from "../lib/axios";

function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get<Quiz[]>("/v1/quiz");
        setQuizzes(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
        <p className="text-error text-lg">{error}</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
        <h2 className="text-xl opacity-70">No quizzes available.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Your Quizzes</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((q) => (
            <div
              key={q.id}
              className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-shadow p-6 justify-between"
            >
              <h3 className="text-xl font-semibold">{q.title}</h3>
              {q.description && (
                <p className="mt-2 text-sm text-base-content/80">{q.description}</p>
              )}
              <button
                className="btn btn-sm btn-primary mt-4 w-full"
                onClick={() => navigate(`/quiz/${q.id}`)}
              >
                View Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizList;
