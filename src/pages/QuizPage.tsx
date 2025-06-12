import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { QuizDTO } from "../types/Quiz";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizDTO | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    
    // Dados mockados para simular o carregamento do quiz
    const mockQuiz: QuizDTO = {
      id: "1",
      userId: "123e4567-e89b-12d3-a456-426614174000",
      title: "Quiz de Geografia e Ciência",
      description: "Teste seus conhecimentos gerais.",
      languageCode: "PT",
      sourceType: "PROMPT_BASED",
      sourceContent: "Mocked content",
      questions: [
        {
          id: "q1",
          questionType: "MULTIPLE_CHOICE",
          statement: "Qual é a capital do Brasil?",
          hint: "Fica no planalto central.",
          explanation:
            "Brasília foi inaugurada em 1960 e é a capital oficial desde então.",
          correctAnswer: "Brasília",
          quizId: "1",
          options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
        },
        {
          id: "q2",
          questionType: "TRUE_OR_FALSE",
          statement: "A água ferve a 100 graus Celsius ao nível do mar.",
          hint: "",
          explanation:
            "Essa é a temperatura padrão de ebulição da água ao nível do mar.",
          correctAnswer: "Verdadeiro",
          quizId: "1",
          options: ["Verdadeiro", "Falso"],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setQuiz(mockQuiz);
  }, []);

  //   const fetchQuiz = async () => {
  //     try {
  //       const response = await fetch(`https://sua-api.com/quizzes/${quizId}`);
  //       const data: QuizDTO = await response.json();
  //       setQuiz(data);
  //     } catch (error) {
  //       console.error("Erro ao carregar o quiz:", error);
  //     }
  //   };

  //   if (quizId) {
  //     fetchQuiz();
  //   }
  // }, [quizId]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!quiz) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setSelectedOption(null);

    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setFinished(false);
  };

  if (!quiz) return <p className="p-6">Carregando quiz...</p>;

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <h1 className="text-2xl font-bold">Resultado</h1>
        <p>
          Você acertou {score} de {quiz.questions.length} perguntas.
        </p>
        <div className="flex gap-4">
          <Button onClick={handleRestart}>Reiniciar</Button>
          <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const renderOptions = () => {
    const options =
      currentQuestion.questionType === "TRUE_OR_FALSE"
        ? ["Verdadeiro", "Falso"]
        : currentQuestion.options;

    return options.map((option) => (
      <Button
        key={option}
        onClick={() => handleOptionSelect(option)}
        className={`w-full ${
          selectedOption === option ? "bg-blue-600 text-white" : ""
        }`}
      >
        {option}
      </Button>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Pergunta {currentQuestionIndex + 1} de {quiz.questions.length}
          </h2>
          <p className="mb-2">{currentQuestion.statement}</p>
          {currentQuestion.hint && (
            <p className="text-sm text-gray-500 mb-4 italic">
              Dica: {currentQuestion.hint}
            </p>
          )}
          <div className="flex flex-col gap-2 mb-6">{renderOptions()}</div>
          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="w-full"
          >
            {currentQuestionIndex + 1 === quiz.questions.length
              ? "Finalizar"
              : "Próxima"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPage;
