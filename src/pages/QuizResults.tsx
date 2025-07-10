import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaTrophy,
  FaMedal,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaRedo,
  FaHome,
  FaLightbulb,
  FaStar,
  FaAward,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../lib/axios";
import type { Quiz, QuizAttemptDTO } from "../types/quiz";
import Layout from "../components/Layout";

function QuizResults() {
  const { quizId, attemptId } = useParams<{ quizId: string; attemptId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttemptDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadResults = async () => {
      if (!quizId || !attemptId) {
        navigate("/home");
        return;
      }

      try {
        const attemptFromState = location.state?.attempt as QuizAttemptDTO | undefined;
        const quizFromState = location.state?.quiz as Quiz | undefined;

        if (attemptFromState && quizFromState) {
          setAttempt(attemptFromState);
          setQuiz(quizFromState);
          setLoading(false);
          return;
        }

        const response = await api.get(`/v1/quiz/attempt/${attemptId}`);
        setAttempt(response.data);
        if (response.data.quizId) {
          const quizResponse = await api.get(`/v1/quiz/${quizId}`);
          setQuiz(quizResponse.data);
        }
      } catch (error) {
        console.error("Error loading results:", error);
        toast.error("Erro ao carregar resultados");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [quizId, attemptId, navigate, location.state]);

  useEffect(() => {
    const fetchUsername = async () => {
      if (attempt && !attempt.guestUser) {
        try {
          const response = await api.get("/v1/me");
          setUsername(response.data.username);
        } catch {
        }
      }
    };
    fetchUsername();
  }, [attempt]);

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return "Excelente!";
    if (score >= 75) return "Ótimo";
    if (score >= 60) return "Bom";
    return "Pode melhorar";
  };

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case "Excelente!":
        return "text-success";
      case "Ótimo":
        return "text-primary";
      case "Bom":
        return "text-warning";
      case "Pode melhorar":
        return "text-error";
      default:
        return "text-base-content";
    }
  };

  const getPerformanceIcon = (level: string) => {
    switch (level) {
      case "Excelente!":
        return <FaTrophy className="text-6xl text-success" />;
      case "Ótimo":
        return <FaMedal className="text-6xl text-primary" />;
      case "Bom":
        return <FaStar className="text-6xl text-warning" />;
      case "Pode melhorar":
        return <FaAward className="text-6xl text-error" />;
      default:
        return <FaChartLine className="text-6xl text-base-content" />;
    }
  };

  const getPerformanceMessage = (level: string) => {
    switch (level) {
      case "Excelente!":
        return "Parabéns! Você demonstrou excelente conhecimento!";
      case "Ótimo":
        return "Muito bem! Você tem um bom domínio do assunto!";
      case "Bom":
        return "Bom trabalho! Continue estudando para melhorar!";
      case "Pode melhorar":
        return "Continue praticando! O conhecimento vem com a prática!";
      default:
        return "Obrigado por participar do quiz!";
    }
  };

  const getRecommendations = (level: string) => {
    switch (level) {
      case "Excelente!":
        return [
          "Continue explorando tópicos avançados",
          "Ajude outros estudantes com suas dúvidas",
          "Tente quizzes mais desafiadores"
        ];
      case "Ótimo":
        return [
          "Revise os tópicos onde você errou",
          "Pratique mais para alcançar a excelência",
          "Explore recursos adicionais de estudo"
        ];
      case "Bom":
        return [
          "Dedique mais tempo aos estudos",
          "Revise os conceitos fundamentais",
          "Faça mais quizzes sobre o mesmo tema"
        ];
      case "Pode melhorar":
        return [
          "Estude os conceitos básicos primeiro",
          "Pratique com quizzes mais simples",
          "Considere buscar ajuda de um tutor"
        ];
      default:
        return ["Continue praticando regularmente"];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calculateStats = () => {
    if (!attempt) return { correct: 0, incorrect: 0, total: 0 };
    
    const correct = attempt.answers.filter(a => a.correct).length;
    const total = attempt.answers.length;
    const incorrect = total - correct;
    
    return { correct, incorrect, total };
  };



  const handleRetakeQuiz = () => {
    navigate(`/quiz/${quizId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4">Carregando resultados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!attempt || !quiz) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Resultados não encontrados</h2>
            <button className="btn btn-primary" onClick={() => navigate("/home")}>
              Voltar ao início
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const performanceLevel = getPerformanceLevel(attempt.score);
  const stats = calculateStats();

  return (
    <Layout>
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              {getPerformanceIcon(performanceLevel)}
            </div>
            <h1 className="text-3xl font-bold mb-2">Resultados do Quiz</h1>
            <h2 className="text-xl text-base-content/70 mb-4">{quiz.title}</h2>
            <p className={`text-lg font-semibold ${getPerformanceColor(performanceLevel)}`}>
              {getPerformanceMessage(performanceLevel)}
            </p>
            
            {/* User Info */}
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-base-content/60">
              <FaUser />
              <span>
                {attempt.guestUser
                  ? `Visitante: ${attempt.guestName || 'Anônimo'}`
                  : username
                    ? `Usuário: ${username}`
                    : 'Usuário Logado'}
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-base-content/60">
              <FaCalendarAlt />
              <span>Concluído em {formatDate(attempt.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Main Score Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <h3 className="card-title justify-center mb-4">
                <FaChartLine className="text-primary" />
                Pontuação Final
              </h3>
              <div className="text-6xl font-bold text-primary mb-2">
                {attempt.score}%
              </div>
              <div className="progress progress-primary w-full">
                <div
                  className="progress-bar"
                  style={{ width: `${attempt.score}%` }}
                ></div>
              </div>
              <p className="text-sm text-base-content/70 mt-2">
                {stats.correct} de {stats.total} questões corretas
              </p>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">
                <FaCheckCircle className="text-success" />
                Estatísticas Detalhadas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Acertos:</span>
                  <span className="font-semibold text-success">
                    {stats.correct}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Erros:</span>
                  <span className="font-semibold text-error">
                    {stats.incorrect}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Total:</span>
                  <span className="font-semibold">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Tempo Total:</span>
                  <span className="font-semibold">
                    {formatTime(attempt.timeSpent)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Tempo Médio/Questão:</span>
                  <span className="font-semibold">
                    {Math.round(attempt.timeSpent / stats.total)}s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Tipo:</span>
                  <span className="font-semibold text-primary">
                    {attempt.guestUser ? 'Visitante' : 'Usuário'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title mb-4">
              <FaLightbulb className="text-warning" />
              Análise de Performance
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-base-200 rounded-lg">
                <div className="text-2xl font-bold text-success mb-2">
                  {Math.round((stats.correct / stats.total) * 100)}%
                </div>
                <div className="text-sm text-base-content/70">Taxa de Acerto</div>
              </div>
              <div className="text-center p-4 bg-base-200 rounded-lg">
                <div className="text-2xl font-bold text-error mb-2">
                  {Math.round((stats.incorrect / stats.total) * 100)}%
                </div>
                <div className="text-sm text-base-content/70">Taxa de Erro</div>
              </div>
              <div className="text-center p-4 bg-base-200 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  {performanceLevel.toUpperCase()}
                </div>
                <div className="text-sm text-base-content/70">Nível</div>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Review */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title mb-4">
              <FaCheckCircle className="text-success" />
              Revisão das Respostas
            </h3>
            <div className="space-y-3">
              {attempt.answers.map((answer, index) => {
                const question = quiz.questions.find(q => q.id === answer.questionId);
                return (
                  <div key={answer.id} className="flex flex-col md:flex-row md:items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      answer.correct ? 'bg-success text-success-content' : 'bg-error text-error-content'
                    }`}>
                      {answer.correct ? <FaCheckCircle /> : <FaTimesCircle />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{question ? question.statement : `Questão ${index + 1}`}</div>
                      <div className="text-sm text-base-content/70">
                        Sua resposta: {question && question.questionType === "TRUE_OR_FALSE" ? (answer.answer === "true" ? "True" : answer.answer === "false" ? "False" : answer.answer) : answer.answer}
                      </div>
                      {!answer.correct && question && (
                        <div className="text-sm text-error mt-1">
                          Resposta correta: {question.questionType === "TRUE_OR_FALSE" ? (question.correctAnswer === "true" ? "True" : question.correctAnswer === "false" ? "False" : question.correctAnswer) : question.correctAnswer}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title mb-4">
              <FaStar className="text-warning" />
              Recomendações
            </h3>
            <div className="space-y-3">
              {getRecommendations(performanceLevel).map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-base-content/80">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/home")}
              >
                <FaHome />
                Voltar ao Início
              </button>
              <button
                className="btn btn-outline btn-secondary"
                onClick={handleRetakeQuiz}
              >
                <FaRedo />
                Refazer Quiz
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
}

export default QuizResults; 