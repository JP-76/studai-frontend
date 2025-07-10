import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import type { Quiz, QuizAttemptDTO } from "../types/quiz";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa";
import Layout from "../components/Layout";

function QuizDetails() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttemptDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "score",
    direction: "desc",
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<"csv" | "xlsx">("csv");

  useEffect(() => {
    const fetchData = async () => {
      if (!quizId) return;
      setLoading(true);
      setError("");
      try {
        // Fetch quiz info
        const quizRes = await api.get(`/v1/quiz/${quizId}`);
        setQuiz(quizRes.data);
        // Fetch attempts
        const attemptsRes = await api.get(`/v1/quiz/${quizId}/attempts`);
        setAttempts(attemptsRes.data);
      } catch (err) {
        setError("Erro ao carregar dados do quiz.");
        setTimeout(() => navigate("/home"), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [quizId, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-base-200">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4">Carregando detalhes do quiz...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-base-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{error}</h2>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/home")}
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!quiz) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-base-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz não encontrado</h2>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/home")}
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  function sanitizeFilename(name: string) {
    return name.replace(/[^a-z0-9\-_. ]/gi, "_").replace(/\s+/g, "_");
  }

  // CSV Export function
  function exportAttemptsToCSV() {
    if (!attempts.length) {
      toast.error("Nenhuma tentativa para exportar.");
      return;
    }
    const header = ["#", "Usuário", "Pontuação", "Tempo Gasto (s)", "Data"];
    const rows = attempts.map((attempt, idx) => [
      idx + 1,
      attempt.guestUser ? attempt.guestName || "Visitante" : "Você",
      `${attempt.score}%`,
      attempt.timeSpent,
      new Date(attempt.createdAt).toLocaleString(),
    ]);
    const csvContent = [
      header.join(","),
      ...rows.map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");
    // Add UTF-8 BOM for Excel compatibility
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `quiz_${quiz ? sanitizeFilename(quiz.title) : "quiz"}_resultados.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV exportado!");
  }

  function exportAttemptsToXLSX() {
    if (!attempts.length) {
      toast.error("Nenhuma tentativa para exportar.");
      return;
    }
    const data = attempts.map((attempt, idx) => ({
      "#": idx + 1,
      Usuário: attempt.guestUser ? attempt.guestName || "Visitante" : "Você",
      Pontuação: `${attempt.score}%`,
      "Tempo Gasto (s)": attempt.timeSpent,
      Data: new Date(attempt.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");

    XLSX.writeFile(
      workbook,
      `quiz_${quiz ? sanitizeFilename(quiz.title) : "quiz"}_resultados.xlsx`
    );
    toast.success("XLSX exportado!");
  }

  const sortedAttempts = [...attempts].sort((a, b) => {
    let comparison = 0;
    switch (sortConfig.key) {
      case "score":
        comparison = a.score - b.score;
        break;
      case "timeSpent":
        comparison = a.timeSpent - b.timeSpent;
        break;
      case "createdAt":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "guestUser":
        comparison = a.guestUser ? 1 : -1; // Guest users first
        break;
      default:
        comparison = 0;
    }
    return sortConfig.direction === "asc" ? comparison : -comparison;
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Info */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
              <p className="mb-2 text-base-content/70">{quiz.description}</p>
              <div className="mb-2 text-sm text-base-content/60">
                <span className="font-semibold">Tipo de Fonte:</span>{" "}
                {quiz.sourceType === "YOUTUBE_VIDEO"
                  ? "Vídeo do YouTube"
                  : quiz.sourceType === "PROMPT_BASED"
                  ? "Tema Livre"
                  : quiz.sourceType === "PDF_CONTENT"
                  ? "Arquivo PDF"
                  : quiz.sourceType}
              </div>
              <div className="mb-2 text-sm text-base-content/60">
                <span className="font-semibold">Conteúdo da Fonte:</span>{" "}
                {quiz.sourceContent}
              </div>
              <div className="mb-2 text-sm text-base-content/60">
                <span className="font-semibold">Idioma:</span>{" "}
                {quiz.languageCode}
              </div>
              <div className="mb-2 text-sm text-base-content/60">
                <span className="font-semibold">Criado em:</span>{" "}
                {new Date(quiz.createdAt).toLocaleString()}
              </div>
              <div className="mb-2 text-sm text-base-content/60">
                <span className="font-semibold">Atualizado em:</span>{" "}
                {new Date(quiz.updatedAt).toLocaleString()}
              </div>
              <div className="mb-2 text-sm text-base-content/60">
                <span className="font-semibold">Total de Questões:</span>{" "}
                {quiz.questions.length}
              </div>
            </div>
          </div>
          {/* Go to Quiz, Share, and Export Buttons */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                className="btn btn-outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/quiz/${quiz.id}/visitor`
                  );
                  toast.success("Link para convidados copiado!");
                }}
              >
                Compartilhar Quiz
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowExportModal(true)}
              >
                Exportar Resultados <FaDownload className="ml-2" />
              </button>
            </div>
            <div>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/quiz/${quiz.id}`)}
              >
                Responder o Quiz
              </button>
            </div>
          </div>
          {/* Export Modal */}
          {showExportModal && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Exportar Resultados</h3>
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="exportType"
                      value="csv"
                      checked={exportType === "csv"}
                      onChange={() => setExportType("csv")}
                      className="radio radio-primary"
                    />
                    <span>Exportar como CSV</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="exportType"
                      value="xlsx"
                      checked={exportType === "xlsx"}
                      onChange={() => setExportType("xlsx")}
                      className="radio radio-primary"
                    />
                    <span>Exportar como XLSX</span>
                  </label>
                </div>
                <div className="modal-action mt-6 flex justify-end gap-2">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setShowExportModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (exportType === "csv") {
                        exportAttemptsToCSV();
                      } else {
                        exportAttemptsToXLSX();
                      }
                      setShowExportModal(false);
                    }}
                  >
                    Exportar
                  </button>
                </div>
              </div>
              <div
                className="modal-backdrop"
                onClick={() => setShowExportModal(false)}
              ></div>
            </div>
          )}
          {/* Attempts List */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-xl font-bold mb-4">Tentativas do Quiz</h2>
              {attempts.length === 0 ? (
                <p className="text-base-content/70">
                  Nenhuma tentativa registrada ainda.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th
                          onClick={() => handleSort("guestUser")}
                          className="cursor-pointer select-none"
                        >
                          Usuário{" "}
                          {sortConfig.key === "guestUser"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th
                          onClick={() => handleSort("score")}
                          className="cursor-pointer select-none"
                        >
                          Pontuação{" "}
                          {sortConfig.key === "score"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th
                          onClick={() => handleSort("timeSpent")}
                          className="cursor-pointer select-none"
                        >
                          Tempo Gasto{" "}
                          {sortConfig.key === "timeSpent"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th
                          onClick={() => handleSort("createdAt")}
                          className="cursor-pointer select-none"
                        >
                          Data{" "}
                          {sortConfig.key === "createdAt"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedAttempts.map((attempt, idx) => (
                        <tr key={attempt.id}>
                          <td>{idx + 1}</td>
                          <td>
                            {attempt.guestUser
                              ? attempt.guestName || "Visitante"
                              : "Você"}
                          </td>
                          <td>{attempt.score}%</td>
                          <td>
                            {Math.round(attempt.timeSpent / 60)}m{" "}
                            {attempt.timeSpent % 60}s
                          </td>
                          <td>
                            {new Date(attempt.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default QuizDetails;
