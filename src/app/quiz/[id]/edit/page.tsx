"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionEdit from "@/components/QuestionEdit";
import Quiz from "@/types/quiz";
import Question from "@/types/question";

const EditQuizPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("id");

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) {
      setError("ID do quiz não fornecido.");
      setLoading(false);
      return;
    }

    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${quizId}`);
        if (!response.ok) throw new Error("Falha ao buscar quiz");

        const data: Quiz = await response.json();

        // Se não houver quiz ou o objeto vier vazio
        if (!data || !data.id) {
          setError("Quiz não encontrado.");
          return;
        }

        // Garantir que as perguntas tenham um array vazio para as opções, caso não existam
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
  }, [quizId]);

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

  const handleSave = async () => {
    try {
      console.log("Quiz salvo:", quiz);
      // Aqui você pode adicionar lógica para salvar as alterações no quiz
      // router.push("/quiz");
    } catch (err) {
      setError("Falha ao salvar quiz");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#232336] text-white">
      {/* Sidebar */}
      <aside className="w-96 bg-gray-800 p-6 flex flex-col justify-between fixed h-full">
        <div>
          <h1 className="text-2xl font-bold">Editar Quiz</h1>
          {/* Campo de título */}
          <input
            type="text"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            className="w-full p-3 border rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
            placeholder="Título do Quiz"
          />
          {/* Campo de descrição */}
          <textarea
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
            className="w-full p-3 border rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
            placeholder="Descrição do Quiz"
            rows={4}
          />
          <div className="mt-4">
            <p className="text-gray-400">
              <strong>{quiz?.questions?.length || 0}</strong> questões
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-4 mt-6">
          <button
            onClick={handleSave}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Salvar
          </button>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Voltar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-96 p-8 w-full">
        <div className="flex flex-col space-y-4 w-full mt-6">
          {quiz.questions &&
            quiz.questions.map((question, index) => (
              <div
                key={index}
                className="flex justify-center py-5 bg-gray-800 rounded-3xl max-w-[650px]"
              >
                <QuestionEdit
                  question={question}
                  onSave={(updatedQuestion: Question) => {
                    const updatedQuestions = [...(quiz.questions || [])];
                    updatedQuestions[index] = updatedQuestion;
                    setQuiz({ ...quiz, questions: updatedQuestions });
                  }}
                />
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default EditQuizPage;
