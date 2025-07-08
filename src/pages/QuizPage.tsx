import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaCheck,
  FaTimes,
  FaUser,
  FaShare,
  FaArrowLeft,
  FaLightbulb,
  FaCopy,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../lib/axios";
import type { Quiz, QuizAnswer, QuizQuestion } from "../types/quiz";

function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if this is a visitor route
  const isVisitorRoute = location.pathname.includes("/visitor");

  // Check if quiz data was passed via navigation state
  const quizFromState = location.state?.quiz as Quiz | undefined;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [visitorName, setVisitorName] = useState("");
  const [nameSet, setNameSet] = useState(false);
  const [username, setUsername] = useState("");

  const [showHints, setShowHints] = useState<boolean[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [liveElapsed, setLiveElapsed] = useState<number>(0);

  useEffect(() => {
    const loadQuizData = async () => {
      if (!id) return;

      // If quiz data is already available from navigation state, use it
      if (quizFromState) {
        setQuiz(quizFromState);
        // Initialize answers array
        const initialAnswers: QuizAnswer[] = quizFromState.questions.map(
          (q: QuizQuestion) => ({
            questionId: q.id,
            selectedAnswer: "",
          })
        );
        setAnswers(initialAnswers);
        // Initialize hints state (all false initially)
        setShowHints(new Array(quizFromState.questions.length).fill(false));
        setLoading(false);
        // For non-visitor routes, set nameSet to true automatically
        if (!isVisitorRoute) {
          setNameSet(true);
        }
        return;
      }

      // Otherwise, fetch quiz data from API
      try {
        // Use different endpoint based on whether it's a visitor route
        const endpoint = isVisitorRoute
          ? `/v1/guest/quiz/${id}`
          : `/v1/quiz/${id}`;
        const response = await api.get(endpoint);
        setQuiz(response.data);
        // Initialize answers array
        const initialAnswers: QuizAnswer[] = response.data.questions.map(
          (q: QuizQuestion) => ({
            questionId: q.id,
            selectedAnswer: "",
          })
        );
        setAnswers(initialAnswers);
        // Initialize hints state (all false initially)
        setShowHints(new Array(response.data.questions.length).fill(false));
        // For non-visitor routes, set nameSet to true automatically
        if (!isVisitorRoute) {
          setNameSet(true);
        }
      } catch {
        toast.error("Erro ao carregar o quiz");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [id, navigate, quizFromState, isVisitorRoute]);

  // For non-visitor routes, set nameSet to true automatically
  useEffect(() => {
    if (!isVisitorRoute) {
      setNameSet(true);
    }
  }, [isVisitorRoute]);

  useEffect(() => {
    // Fetch username for logged-in users
    const fetchUsername = async () => {
      if (!isVisitorRoute) {
        try {
          const response = await api.get("/v1/me");
          setUsername(response.data.username);
        } catch {
          // Optionally handle error (e.g., redirect to login)
        }
      }
    };
    fetchUsername();
  }, [isVisitorRoute]);

  useEffect(() => {
    if (!loading && quiz) {
      setStartTime(Date.now());
    }
  }, [loading, quiz]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (!loading && quiz && startTime) {
      interval = setInterval(() => {
        setLiveElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, quiz, startTime]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === questionId ? { ...a, selectedAnswer: answer } : a
      )
    );
  };

  const isAnswerSelected = (questionIndex: number, answerValue: string) => {
    const answer = answers[questionIndex];
    return answer?.selectedAnswer === answerValue;
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Check if all questions are answered
    const unansweredQuestions = answers.filter((a) => !a.selectedAnswer);
    if (unansweredQuestions.length > 0) {
      toast.error("Por favor, responda todas as questões antes de finalizar.");
      return;
    }

    // Convert answers array to object { [questionId]: selectedAnswer }
    const answersObject = answers.reduce((acc, curr) => {
      acc[curr.questionId] = curr.selectedAnswer;
      return acc;
    }, {} as Record<string, string>);

    const endTime = Date.now();
    const elapsed = startTime ? Math.floor((endTime - startTime) / 1000) : 0; // in seconds
    setTimeSpent(elapsed);

    const payload = {
      quizId: quiz.id,
      timeSpent: elapsed,
      guestName: isVisitorRoute ? visitorName : username,
      answers: answersObject,
    };

    // Select endpoint based on user type
    const endpoint = isVisitorRoute ? "/v1/guest/quiz/attempt" : "/v1/quiz/attempt";

    try {
      const response = await api.post(endpoint, payload);
      toast.success("Quiz finalizado com sucesso!");
      // Navigate to results page with quiz and attempt data
      navigate(`/quiz/${quiz.id}/results/${response.data.id}`, {
        state: {
          quiz: quiz,
          attempt: response.data,
        },
        replace: true,
      });
    } catch {
      toast.error("Erro ao enviar respostas");
    }
  };

  const handleShareQuiz = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    const visitorUrl = `${window.location.origin}/quiz/${id}/visitor`;
    navigator.clipboard.writeText(visitorUrl);
    toast.success("Link copiado para a área de transferência!");
    setShowShareModal(false);
  };

  const toggleHint = (questionIndex: number) => {
    setShowHints((prev) =>
      prev.map((show, index) => (index === questionIndex ? !show : show))
    );
  };

  const getQuestionProgress = () => {
    const answered = answers.filter((a) => a.selectedAnswer).length;
    return `${answered}/${quiz?.questions.length || 0}`;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Carregando quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz não encontrado</h2>
          <button className="btn btn-primary" onClick={() => navigate("/home")}>
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  // Visitor name input screen (only for visitor route)
  if (isVisitorRoute && !nameSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
        <div className="max-w-md mx-auto mt-20">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <FaUser className="text-4xl text-primary mx-auto mb-4" />
              <h2 className="card-title justify-center mb-4">
                Participar como Visitante
              </h2>
              <p className="text-base-content/70 mb-6">
                Digite seu nome para participar do quiz
              </p>

              <div className="form-control">
                <input
                  type="text"
                  placeholder="Seu nome"
                  className="input input-bordered input-lg"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && visitorName.trim()) {
                      setNameSet(true);
                    }
                  }}
                />
              </div>

              <div className="card-actions justify-center mt-6">
                <button
                  className="btn btn-ghost"
                  onClick={() => navigate(`/quiz/${id}`)}
                >
                  Voltar
                </button>
                <button
                  className="btn btn-primary"
                  disabled={!visitorName.trim()}
                  onClick={() => setNameSet(true)}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }



  const currentQ = quiz?.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{quiz.title}</h1>
                {isVisitorRoute && visitorName && (
                  <p className="text-base-content/70">
                    Participante: {visitorName}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-base-content/70">Tempo</div>
                <div className="text-lg font-bold">{formatTime(liveElapsed)}</div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <progress
                className="progress progress-primary flex-1 mr-4"
                value={answers.filter((a) => a.selectedAnswer).length}
                max={quiz.questions.length}
              ></progress>

              {!isVisitorRoute && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleShareQuiz}
                  title="Compartilhar quiz com visitantes"
                >
                  <FaShare />
                  Compartilhar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-wrap gap-2 justify-center">
              {quiz.questions.map((_, index) => {
                const isAnswered = answers[index]?.selectedAnswer;
                const isCurrent = index === currentQuestion;

                return (
                  <button
                    key={index}
                    className={`btn btn-sm ${
                      isCurrent
                        ? "btn-primary"
                        : isAnswered
                        ? "btn-success"
                        : "btn-outline"
                    }`}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Question */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Questão {currentQuestion + 1}
              </h2>
              <div className="badge badge-outline">
                {currentQ.questionType === "MULTIPLE_CHOICE"
                  ? "Múltipla Escolha"
                  : "Verdadeiro/Falso"}
              </div>
            </div>

            <p className="text-lg mb-6">{currentQ.statement}</p>

            {currentQ.hint && (
              <div className="mb-6">
                <button
                  onClick={() => toggleHint(currentQuestion)}
                  className="btn btn-outline btn-sm mb-4"
                >
                  <FaLightbulb className="mr-2" />
                  {showHints[currentQuestion] ? "Ocultar Dica" : "Mostrar Dica"}
                </button>
                {showHints[currentQuestion] && (
                  <div className="alert alert-info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-current shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>
                      <strong>Dica:</strong> {currentQ.hint}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {currentQ.questionType === "TRUE_OR_FALSE" ? (
                <>
                  <label className="cursor-pointer">
                    <div
                      className={`card ${
                        isAnswerSelected(currentQuestion, "True")
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-base-200 hover:bg-base-300 border-2 border-transparent"
                      } transition-colors duration-150`}
                    >
                      <div className="card-body flex-row items-center p-4">
                        <input
                          type="radio"
                          name={`question-${currentQ.id}`}
                          className="radio radio-primary mr-3"
                          checked={isAnswerSelected(currentQuestion, "True")}
                          onChange={() =>
                            handleAnswerChange(currentQ.id, "True")
                          }
                        />
                        <span className="flex-1">Verdadeiro</span>
                        <FaCheck className="text-success" />
                      </div>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <div
                      className={`card ${
                        isAnswerSelected(currentQuestion, "False")
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-base-200 hover:bg-base-300 border-2 border-transparent"
                      } transition-colors duration-150`}
                    >
                      <div className="card-body flex-row items-center p-4">
                        <input
                          type="radio"
                          name={`question-${currentQ.id}`}
                          className="radio radio-primary mr-3"
                          checked={isAnswerSelected(currentQuestion, "False")}
                          onChange={() =>
                            handleAnswerChange(currentQ.id, "False")
                          }
                        />
                        <span className="flex-1">Falso</span>
                        <FaTimes className="text-error" />
                      </div>
                    </div>
                  </label>
                </>
              ) : (
                currentQ.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="cursor-pointer">
                    <div
                      className={`card ${
                        isAnswerSelected(currentQuestion, option)
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-base-200 hover:bg-base-300 border-2 border-transparent"
                      } transition-colors duration-150`}
                    >
                      <div className="card-body flex-row items-center p-4">
                        <input
                          type="radio"
                          name={`question-${currentQ.id}`}
                          className="radio radio-primary mr-3"
                          checked={isAnswerSelected(currentQuestion, option)}
                          onChange={() =>
                            handleAnswerChange(currentQ.id, option)
                          }
                        />
                        <span className="flex-1">{option}</span>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between">
              <button
                className="btn btn-outline"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
              >
                <FaArrowLeft />
                Anterior
              </button>

              <div className="flex gap-2">
                {currentQuestion === quiz.questions.length - 1 ? (
                  <button
                    className="btn btn-success btn-lg"
                    onClick={handleSubmit}
                    disabled={
                      answers.filter((a) => a.selectedAnswer).length !==
                      quiz.questions.length
                    }
                  >
                    <FaCheck />
                    Finalizar Quiz
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    disabled={currentQuestion === quiz.questions.length - 1}
                    onClick={() => setCurrentQuestion((prev) => prev + 1)}
                  >
                    Próxima
                    <FaArrowLeft className="rotate-180" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              <FaShare className="inline mr-2" />
              Compartilhar Quiz
            </h3>
            <p className="text-base-content/70 mb-4">
              Copie o link abaixo para compartilhar este quiz com visitantes:
            </p>

            <div className="form-control mb-6">
              <div className="join w-full">
                <input
                  type="text"
                  value={`${window.location.origin}/quiz/${id}/visitor`}
                  readOnly
                  className="input input-bordered join-item flex-1"
                />
                <button
                  className="btn btn-primary join-item"
                  onClick={handleCopyLink}
                >
                  <FaCopy />
                  Copiar
                </button>
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowShareModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowShareModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
