"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionDisplay from "@/components/QuestionDisplay";

interface Question {
  id: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  statement: string;
  options: string[];
  hint?: string;
  explanation?: string;
  correctAnswer?: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  sourceUri: string;
  questions: Question[];
  attempts: { date: string; success: boolean }[]; // Mock data for attempts
}

const extractYouTubeVideoId = (url: string): string | null => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const QuizDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const mockQuiz = {
    id: "1",
    title: "Quiz de Matemática",
    description: "Desafie-se com questões matemáticas básicas e avançadas.",
    sourceType: "YOUTUBE_VIDEO",
    sourceUri: "https://www.youtube.com/watch?v=gg_tFb2ohx4",
    questions: [
      {
        id: "q1",
        questionType: "MULTIPLE_CHOICE",
        statement: "Quanto é 5 + 3?",
        hint: "Pense em quantos dedos você tem em uma mão e adicione três.",
        explanation: "5 + 3 é igual a 8.",
        correctAnswer: 2,
        options: ["6", "7", "8"],
      },
      {
        id: "q2",
        questionType: "MULTIPLE_CHOICE",
        statement: "Qual é a raiz quadrada de 16?",
        hint: "Um número multiplicado por ele mesmo dá 16.",
        explanation: "A raiz quadrada de 16 é 4.",
        correctAnswer: 1,
        options: ["3", "4", "5"],
      },
      {
        id: "q3",
        questionType: "TRUE_FALSE",
        statement: "O número π (pi) é um número racional.",
        hint: "Ele tem infinitas casas decimais e não pode ser escrito como fração.",
        explanation:
          "O número π é irracional, pois não pode ser expresso como fração exata.",
        correctAnswer: 1, // Falso
      },
      {
        id: "q4",
        questionType: "MULTIPLE_CHOICE",
        statement: "Quanto é 5 + 3?",
        hint: "Pense em quantos dedos você tem em uma mão e adicione três.",
        explanation: "5 + 3 é igual a 8.",
        correctAnswer: 2,
        options: ["6", "7", "8"],
      },
      {
        id: "q5",
        questionType: "MULTIPLE_CHOICE",
        statement: "Qual é a raiz quadrada de 16?",
        hint: "Um número multiplicado por ele mesmo dá 16.",
        explanation: "A raiz quadrada de 16 é 4.",
        correctAnswer: 1,
        options: ["3", "4", "5"],
      },
      {
        id: "q6",
        questionType: "TRUE_FALSE",
        statement: "O número π (pi) é um número racional.",
        hint: "Ele tem infinitas casas decimais e não pode ser escrito como fração.",
        explanation:
          "O número π é irracional, pois não pode ser expresso como fração exata.",
        correctAnswer: 1, // Falso
      },
      {
        id: "q7",
        questionType: "MULTIPLE_CHOICE",
        statement: "Quanto é 5 + 3?",
        hint: "Pense em quantos dedos você tem em uma mão e adicione três.",
        explanation: "5 + 3 é igual a 8.",
        correctAnswer: 2,
        options: ["6", "7", "8"],
      },
      {
        id: "q8",
        questionType: "MULTIPLE_CHOICE",
        statement: "Qual é a raiz quadrada de 16?",
        hint: "Um número multiplicado por ele mesmo dá 16.",
        explanation: "A raiz quadrada de 16 é 4.",
        correctAnswer: 1,
        options: ["3", "4", "5"],
      },
      {
        id: "q9",
        questionType: "TRUE_FALSE",
        statement: "O número π (pi) é um número racional.",
        hint: "Ele tem infinitas casas decimais e não pode ser escrito como fração.",
        explanation:
          "O número π é irracional, pois não pode ser expresso como fração exata.",
        correctAnswer: 1, // Falso
      },
      {
        id: "q10",
        questionType: "MULTIPLE_CHOICE",
        statement: "Quanto é 5 + 3?",
        hint: "Pense em quantos dedos você tem em uma mão e adicione três.",
        explanation: "5 + 3 é igual a 8.",
        correctAnswer: 2,
        options: ["6", "7", "8"],
      },
      {
        id: "q11",
        questionType: "MULTIPLE_CHOICE",
        statement: "Qual é a raiz quadrada de 16?",
        hint: "Um número multiplicado por ele mesmo dá 16.",
        explanation: "A raiz quadrada de 16 é 4.",
        correctAnswer: 1,
        options: ["3", "4", "5"],
      },
      {
        id: "q12",
        questionType: "TRUE_FALSE",
        statement: "O número π (pi) é um número racional.",
        hint: "Ele tem infinitas casas decimais e não pode ser escrito como fração.",
        explanation:
          "O número π é irracional, pois não pode ser expresso como fração exata.",
        correctAnswer: 1, // Falso
      },
    ],
    attempts: [
      { date: "2025-02-10 14:30", scorePercentage: 80 },
      { date: "2025-02-09 11:45", scorePercentage: 40 },
      { date: "2025-02-08 16:20", scorePercentage: 100 },
      { date: "2025-02-07 19:00", scorePercentage: 60 },
      { date: "2025-02-06 10:00", scorePercentage: 90 },
    ],
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setTimeout(() => {
          setQuiz(mockQuiz); // Definindo o mock de quiz
          setLoading(false);
        }, 1000); // Delay de 1 segundo
      } catch (err) {
        setError("Falha ao buscar quiz");
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Carregando detalhes do quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
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
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
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

  const videoId = extractYouTubeVideoId(quiz.sourceUri);
  const videoThumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
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
            <strong>{quiz.questions.length}</strong> questões
          </p>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-white">
              Últimas Tentativas:
            </h2>
            <ul className="text-gray-300 mt-2 space-y-2">
              {quiz.attempts.slice(0, 5).map((attempt, index) => (
                <li key={index} className="flex justify-between">
                  <span>Data: {attempt.date}</span>
                  <span
                    className={`font-bold
                              ${
                                attempt.scorePercentage >= 80
                                  ? "text-green-500"
                                  : ""
                              }
                              ${
                                attempt.scorePercentage >= 50 &&
                                attempt.scorePercentage < 80
                                  ? "text-yellow-500"
                                  : ""
                              }
                              ${
                                attempt.scorePercentage < 50
                                  ? "text-red-500"
                                  : ""
                              }`}
                  >
                    {attempt.scorePercentage}%
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
          {quiz.questions.map((question) => (
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
