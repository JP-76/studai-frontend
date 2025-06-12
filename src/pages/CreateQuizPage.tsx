import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Card, CardContent } from "../components/ui/Card";
import type { QuizCreateDTO } from "../types/QuizCreate";

const CreateQuizPage = () => {
  const [sourceContent, setSourceContent] = useState("");
  const [sourceType, setSourceType] = useState<"YOUTUBE_VIDEO" | "FILE_UPLOAD" | "PROMPT_BASED">("PROMPT_BASED");
  const [languageCode, setLanguageCode] = useState<"PT" | "EN">("PT");
  const [questionsQuantity, setQuestionsQuantity] = useState(5);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const newQuiz: QuizCreateDTO = {
      questionsQuantity,
      sourceContent,
      sourceType,
      languageCode,
    };

    console.log("Enviando QuizCreateDTO:", newQuiz);
    // await fetch('/api/quizzes', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newQuiz),
    // });

    navigate("/quizzes");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold mb-4">Criar Novo Quiz</h1>

          <label className="block text-sm font-medium">Tipo de Fonte</label>
          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="YOUTUBE_VIDEO">Vídeo do YouTube</option>
            <option value="PROMPT_BASED">Texto Manual</option>
            <option value="FILE_UPLOAD" disabled>Arquivo (em breve)</option>
          </select>

          <label className="block text-sm font-medium mt-2">Conteúdo Fonte</label>
          <Textarea
            placeholder={
              sourceType === "YOUTUBE_VIDEO"
                ? "Cole a URL do vídeo aqui"
                : "Digite o conteúdo para gerar as perguntas"
            }
            value={sourceContent}
            onChange={(e) => setSourceContent(e.target.value)}
          />

          <label className="block text-sm font-medium mt-2">Idioma</label>
          <select
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="PT">Português</option>
            <option value="EN">Inglês</option>
          </select>

          <label className="block text-sm font-medium mt-2">Quantidade de Perguntas</label>
          <Input
            type="number"
            min={1}
            max={20}
            value={questionsQuantity}
            onChange={(e) => setQuestionsQuantity(parseInt(e.target.value))}
          />

          <Button
            onClick={handleSubmit}
            disabled={!sourceContent || questionsQuantity < 1}
          >
            Criar Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateQuizPage;
