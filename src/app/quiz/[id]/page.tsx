"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MultipleChoiceQuestion from "@/components/MultipleChoiceQuestion";
import TrueFalseQuestion from "@/components/TrueFalseQuestion";
import Quiz from "@/types/quiz";

const extractYouTubeVideoId = (url: string): string | null => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const QuizPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<(number | null)[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${params.id}`);
        if (!response.ok) throw new Error("Falha ao buscar quiz");
        const data: Quiz = await response.json();
        const updatedQuestions = (data.questions || []).map((question) => ({
          ...question,
          options: question.options || [],
        }));
        setQuiz({ ...data, questions: updatedQuestions });
        setSelectedOptions(new Array(updatedQuestions.length).fill(null));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [params.id]);

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (!isSubmitted) {
      const newSelections = [...selectedOptions];
      newSelections[questionIndex] = optionIndex;
      setSelectedOptions(newSelections);
    }
  };

  const handleSubmit = () => {
    const correctCount =
      quiz?.questions?.reduce((count, question, index) => {
        return (
          count + (selectedOptions[index] === question.correctAnswer ? 1 : 0)
        );
      }, 0) || 0;

    setCorrectAnswers(correctCount);
    setIsSubmitted(true);
    setShowExplanation(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Carregando quiz...</p>
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
  const accuracyPercentage = quiz?.questions ? ((correctAnswers / quiz.questions.length) * 100).toFixed(2) : "0.00";

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
          {quiz.sourceType === "YOUTUBE_VIDEO" && quiz.sourceUri && (
            <a
              href={quiz.sourceUri}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-blue-400 hover:underline"
            >
              Assista ao vídeo no Youtube 🎥
            </a>
          )}
          <h1 className="mt-4 text-2xl font-bold">{quiz.title}</h1>
          <p className="mt-2 text-gray-300">{quiz.description}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Voltar
        </button>
      </aside>

      <main className="ml-96 p-8 w-full">
        {quiz.questions && quiz.questions.map((question, index) => (
          <div key={question.id} className="mb-6">
            {question.questionType === "MULTIPLE_CHOICE" ? (
              <MultipleChoiceQuestion
                question={question}
                selectedOption={selectedOptions[index]}
                onOptionSelect={(optionIndex) =>
                  handleOptionSelect(index, optionIndex)
                }
                isSubmitted={isSubmitted}
                showExplanation={showExplanation}
                onAnswerSelection={() => {}}
              />
            ) : (
              <TrueFalseQuestion
                question={question}
                selectedOption={selectedOptions[index]}
                onOptionSelect={(optionIndex) =>
                  handleOptionSelect(index, optionIndex)
                }
                isSubmitted={isSubmitted}
                showExplanation={showExplanation}
                onAnswerSelection={() => {}}
              />
            )}
          </div>
        ))}
        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Enviar Respostas
          </button>
        )}
        {isSubmitted && (
          <div className="flex items-center space-x-4">
            <p className="mt-4 text-green-400">
              Você acertou {accuracyPercentage}% das questões! 🎉
            </p>
            <button
              onClick={() => router.push("/meus-quizzes")}
              className="mt-6 px-6 py-3 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              Ir para meus quizzes
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
