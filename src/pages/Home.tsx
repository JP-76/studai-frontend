import { useState } from "react";
import { FaBook, FaYoutube, FaRocket, FaBrain } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import Layout from "../components/Layout";

function Home() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<"tema" | "url" | null>(
    null
  );
  const [freeTheme, setFreeTheme] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateYoutubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const extractYoutubeId = (url: string): string | null => {
    const regexPatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of regexPatterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const handleGenerateQuiz = async () => {
    if (!selectedOption) {
      toast.error("Selecione uma opção para gerar o quiz");
      return;
    }

    if (selectedOption === "tema" && !freeTheme.trim()) {
      toast.error("Digite um tema para o quiz");
      return;
    }

    if (selectedOption === "url" && !validateYoutubeUrl(youtubeUrl)) {
      toast.error("Digite uma URL válida do YouTube");
      return;
    }

    if (selectedOption === "url" && !extractYoutubeId(youtubeUrl)) {
      toast.error("Não foi possível extrair o ID do vídeo do YouTube");
      return;
    }

    setIsLoading(true);

    try {
      // Aqui você fará a requisição para a API
      const payload =
        selectedOption === "tema"
          ? {
              questionsQuantity: 10,
              sourceType: "PROMPT_BASED",
              languageCode: "PT",
              sourceContent: freeTheme,
            }
          : {
              questionsQuantity: 10,
              sourceType: "YOUTUBE_VIDEO",
              languageCode: "PT",
              sourceContent: extractYoutubeId(youtubeUrl), // Enviando apenas o ID
            };

      const result = await api.post("/v1/quiz", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Quiz generated:", result.data);

      toast.success("Quiz gerado com sucesso!");

      // Navigate to quiz page with quiz data
      navigate(`/quiz/${result.data.id}`, {
        state: { quiz: result.data },
      });
    } catch (error: unknown) {
      console.error("Error generating quiz:", error);

      // Verificar se é um erro de axios
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as { response?: { status: number } };

        // Erro 500 específico para YouTube
        if (axiosError.response?.status === 500 && selectedOption === "url") {
          toast.error(
            "🔧 Funcionalidade do YouTube está temporariamente fora do ar. Tente novamente mais tarde ou use a opção 'Tema Livre'."
          );
        } else if (axiosError.response?.status === 500) {
          toast.error("Erro interno do servidor. Tente novamente mais tarde.");
        } else if (axiosError.response?.status === 401) {
          toast.error("Sessão expirada. Faça login novamente.");
        } else if (axiosError.response?.status === 400) {
          toast.error("Dados inválidos. Verifique as informações enviadas.");
        } else {
          toast.error("Erro ao gerar quiz. Tente novamente.");
        }
      } else {
        toast.error("Erro ao gerar quiz. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <FaBrain className="text-4xl text-primary" />
              <h1 className="text-4xl font-bold text-base-content">StudAI</h1>
            </div>
            <p className="text-lg text-base-content/70">
              Gere quizzes inteligentes com IA para acelerar seu aprendizado
            </p>
          </div>

          {/* Main Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
                <FaRocket className="text-primary" />
                Criar Novo Quiz
              </h2>

              {/* Options */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {/* Tema Livre */}
                <div
                  className={`card cursor-pointer transition-all hover:shadow-lg ${
                    selectedOption === "tema"
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-base-200 hover:bg-base-300"
                  }`}
                  onClick={() => setSelectedOption("tema")}
                >
                  <div className="card-body items-center text-center p-6">
                    <FaBook className="text-3xl text-primary mb-3" />
                    <h3 className="card-title text-lg">Tema Livre</h3>
                    <p className="text-sm text-base-content/70">
                      Escolha qualquer assunto que quiser estudar
                    </p>
                  </div>
                </div>

                {/* URL YouTube */}
                <div
                  className={`card cursor-pointer transition-all hover:shadow-lg ${
                    selectedOption === "url"
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-base-200 hover:bg-base-300"
                  }`}
                  onClick={() => setSelectedOption("url")}
                >
                  <div className="card-body items-center text-center p-6">
                    <FaYoutube className="text-3xl text-error mb-3" />
                    <h3 className="card-title text-lg">Vídeo do YouTube</h3>
                    <p className="text-sm text-base-content/70">
                      Gere um quiz baseado em um vídeo do YouTube
                    </p>
                    <div className="badge badge-warning badge-sm mt-2">
                      ⚠️ Instável
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Section */}
              {selectedOption && (
                <div className="transition-all duration-300 ease-in-out">
                  <div className="divider my-2"></div>

                  {selectedOption === "tema" && (
                    <div className="form-control space-y-4">
                      <label className="label">
                        <span className="label-text font-medium text-lg">
                          Qual tema você gostaria de estudar?
                        </span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered textarea-lg min-h-32 w-full resize-y"
                        placeholder="Ex: História do Brasil, Matemática básica, Programação em Python..."
                        value={freeTheme}
                        onChange={(e) => setFreeTheme(e.target.value)}
                        rows={4}
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Seja específico para obter melhores resultados
                        </span>
                      </label>
                    </div>
                  )}

                  {selectedOption === "url" && (
                    <div className="form-control space-y-4">
                      <div className="alert alert-warning">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="stroke-current shrink-0 h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <span className="text-sm">
                          <strong>Aviso:</strong> A funcionalidade de análise de
                          vídeos do YouTube está em fase beta e pode apresentar
                          instabilidade.
                        </span>
                      </div>

                      <label className="label">
                        <span className="label-text font-medium text-lg">
                          Cole o link do YouTube aqui
                        </span>
                      </label>
                      <input
                        type="url"
                        className="input input-bordered input-lg w-full"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                      />
                      <label className="label">
                        <span className="label-text-alt">
                          {youtubeUrl && !validateYoutubeUrl(youtubeUrl) && (
                            <span className="text-error font-medium">
                              ⚠️ URL inválida do YouTube
                            </span>
                          )}
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Generate Button */}
                  <div className="card-actions justify-center mt-8">
                    <button
                      className="btn btn-primary btn-lg btn-wide"
                      onClick={handleGenerateQuiz}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Gerando Quiz...
                        </>
                      ) : (
                        <>
                          <FaRocket />
                          Gerar Quiz
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <div className="badge badge-primary badge-lg mb-2">⚡</div>
                <h3 className="font-bold">Rápido</h3>
                <p className="text-sm text-base-content/70">
                  Quiz gerado em segundos
                </p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <div className="badge badge-secondary badge-lg mb-2">🎯</div>
                <h3 className="font-bold">Personalizado</h3>
                <p className="text-sm text-base-content/70">
                  Adaptado ao seu conteúdo
                </p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <div className="badge badge-accent badge-lg mb-2">🧠</div>
                <h3 className="font-bold">Inteligente</h3>
                <p className="text-sm text-base-content/70">Powered by AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
