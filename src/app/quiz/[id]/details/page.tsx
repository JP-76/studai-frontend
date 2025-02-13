"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionDisplay from "@/components/QuestionDisplay";
import Quiz from "@/types/quiz";

const QuizDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${params.id}`);
        if (!response.ok) throw new Error("Falha ao buscar quiz");
        const data: Quiz = await response.json();
        const updatedQuestions = data.questions ? data.questions.map((question) => ({
          ...question,
          options: question.options || [],
        })) : [];
        setQuiz({ ...data, questions: updatedQuestions });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#232336] text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Carregando detalhes do quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#232336] text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Quiz não encontrado.</p>
          <p className="text-gray-400 mb-6">
            Parece que o quiz que você está procurando não existe ou foi
            removido.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Voltar para a página anterior
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#232336] text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Erro: {error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Voltar para a página anterior
          </button>
        </div>
      </div>
    );
  }

  const videoId = quiz.sourceUri;
  const videoThumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  return (
    <div className="flex min-h-screen bg-[#232336] text-white">
      <aside className="w-96 bg-gray-800 p-6 flex flex-col justify-between fixed h-full">
        <div>
          {videoThumbnail && (
            <img
              src={videoThumbnail}
              alt={`Thumbnail do vídeo ${quiz.title}`}
              className="mb-0 rounded w-full aspect-w-16 aspect-h-9 object-cover"
            />
          )}
          <h1 className="mt-4 text-2xl font-bold">{quiz.title}</h1>
          <p className="mt-2 text-gray-300">{quiz.description}</p>
          <p className="mt-2 text-gray-300">
            <strong>{quiz.questions ? quiz.questions.length : 0}</strong> questões
          </p>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-white">
              Últimas Tentativas:
            </h2>
            <ul className="text-gray-300 mt-2 space-y-2">
              {quiz.attempts && quiz.attempts.slice(0, 5).map((attempt, index) => (
                <li key={index} className="flex justify-between">
                  <span>Data: {new Date(attempt.completionDate).toLocaleDateString('pt-BR')}</span>
                  <span
                    className={`font-bold
                              ${
                                attempt.score >= 80
                                  ? "text-green-500"
                                  : ""
                              }
                              ${
                                attempt.score >= 50 &&
                                attempt.score < 80
                                  ? "text-yellow-500"
                                  : ""
                              }
                              ${
                                attempt.score < 50
                                  ? "text-red-500"
                                  : ""
                              }`}
                  >
                    {attempt.score}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col space-y-4 mt-6">
          <button
            onClick={() => router.push(`/quiz/${quiz.id}/edit`)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Editar Quiz
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Voltar
          </button>
        </div>
      </aside>

      <main className="ml-96 p-8 w-full max-w-[60rem] mx-auto">
        <h2 className="text-xl font-semibold mb-4">Questões:</h2>
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
          {quiz.questions && quiz.questions.map((question) => (
            <div key={question.id} className="mb-4">
              <QuestionDisplay question={question} showExplanation={true} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default QuizDetailsPage;
