"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MultipleChoiceQuestion from "@/components/MultipleChoiceQuestion";
import TrueFalseQuestion from "@/components/TrueFalseQuestion";

// Função para extrair o ID do vídeo do YouTube
const extractYouTubeVideoId = (url: string) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const mockQuizzes = {
  "1": {
    id: "1",
    title: "Quiz de Matemática",
    description: "Desafie-se com questões matemáticas básicas e avançadas.",
    sourceType: "YOUTUBE_VIDEO",
    sourceUri: "https://www.youtube.com/watch?v=abc1234",
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
        explanation: "O número π é irracional, pois não pode ser expresso como fração exata.",
        correctAnswer: 1, // Falso
      },
    ],
  },
  "2": {
    id: "2",
    title: "Quiz de História",
    description: "Teste seus conhecimentos sobre a história do mundo.",
    sourceType: "YOUTUBE_VIDEO",
    sourceUri: "https://www.youtube.com/watch?v=xyz5678",
    questions: [
      {
        id: "q1",
        questionType: "MULTIPLE_CHOICE",
        statement: "Em que ano ocorreu a Revolução Francesa?",
        hint: "Foi no final do século XVIII.",
        explanation: "A Revolução Francesa começou em 1789 e teve grande impacto na política europeia.",
        correctAnswer: 0,
        options: ["1789", "1815", "1600"],
      },
      {
        id: "q2",
        questionType: "MULTIPLE_CHOICE",
        statement: "Quem foi o primeiro presidente dos Estados Unidos?",
        hint: "Ele aparece na nota de um dólar.",
        explanation: "George Washington foi o primeiro presidente dos EUA, governando de 1789 a 1797.",
        correctAnswer: 1,
        options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson"],
      },
      {
        id: "q3",
        questionType: "TRUE_FALSE",
        statement: "A Primeira Guerra Mundial começou em 1914.",
        hint: "Foi causada pelo assassinato do arquiduque Francisco Ferdinando.",
        explanation: "A Primeira Guerra Mundial começou em 1914, após o assassinato do arquiduque austríaco.",
        correctAnswer: 0, // Verdadeiro
      },
    ],
  },
  "3": {
    id: "3",
    title: "Quiz de Ciências",
    description: "Vamos testar seus conhecimentos sobre biologia, química e física!",
    sourceType: "YOUTUBE_VIDEO",
    sourceUri: "https://www.youtube.com/watch?v=science123",
    questions: [
      {
        id: "q1",
        questionType: "MULTIPLE_CHOICE",
        statement: "Qual gás as plantas absorvem durante a fotossíntese?",
        hint: "É um gás que nós exalamos ao respirar.",
        explanation: "As plantas absorvem dióxido de carbono (CO₂) e liberam oxigênio (O₂).",
        correctAnswer: 2,
        options: ["Oxigênio", "Nitrogênio", "Dióxido de carbono"],
      },
      {
        id: "q2",
        questionType: "TRUE_FALSE",
        statement: "A água ferve a 100°C ao nível do mar.",
        hint: "Esse é um dos pontos físicos fundamentais da água.",
        explanation: "A água realmente ferve a 100°C ao nível do mar, mas esse ponto pode variar com a altitude.",
        correctAnswer: 0, // Verdadeiro
      },
    ],
  },
  "4": {
    id: "4",
    title: "Quiz de Tecnologia",
    description: "Veja se você está atualizado no mundo da tecnologia!",
    sourceType: "YOUTUBE_VIDEO",
    sourceUri: "https://www.youtube.com/watch?v=technews123",
    questions: [
      {
        id: "q1",
        questionType: "MULTIPLE_CHOICE",
        statement: "Quem é considerado o fundador da Microsoft?",
        hint: "Ele também criou a Fundação Bill & Melinda Gates.",
        explanation: "Bill Gates fundou a Microsoft em 1975, junto com Paul Allen.",
        correctAnswer: 1,
        options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg"],
      },
      {
        id: "q2",
        questionType: "TRUE_FALSE",
        statement: "O sistema operacional Linux foi criado por Linus Torvalds.",
        hint: "O nome do criador é bem parecido com o nome do sistema.",
        explanation: "Linus Torvalds desenvolveu o Linux em 1991.",
        correctAnswer: 0, // Verdadeiro
      },
    ],
  },
  "5": {
    id: "5",
    title: "Quiz de Geografia",
    description: "Teste seus conhecimentos sobre países, capitais e características geográficas!",
    sourceType: "YOUTUBE_VIDEO",
    sourceUri: "https://www.youtube.com/watch?v=geoquiz123",
    questions: [
      {
        id: "q1",
        questionType: "MULTIPLE_CHOICE",
        statement: "Qual é a capital da França?",
        hint: "É uma cidade famosa pela Torre Eiffel.",
        explanation: "A capital da França é Paris.",
        correctAnswer: 0,
        options: ["Paris", "Londres", "Berlim"],
      },
      {
        id: "q2",
        questionType: "MULTIPLE_CHOICE",
        statement: "Qual é o maior continente do mundo?",
        hint: "É o continente onde se encontra a China.",
        explanation: "O maior continente do mundo é a Ásia.",
        correctAnswer: 2,
        options: ["África", "América", "Ásia"],
      },
      {
        id: "q3",
        questionType: "TRUE_FALSE",
        statement: "A Amazônia é o maior deserto do mundo.",
        hint: "A Amazônia é uma floresta tropical, não um deserto.",
        explanation: "A Amazônia é uma floresta tropical, e não um deserto. O maior deserto é o Saara.",
        correctAnswer: 1, // Falso
      },
    ],
  },
  "6": {
    id: "6",
    title: "Quiz de Esportes",
    description: "Desafie seus conhecimentos sobre esportes e atletas!",
    sourceType: "YOUTUBE_VIDEO",
    sourceUri: "https://www.youtube.com/watch?v=sportsquiz123",
    questions: [
      {
        id: "q1",
        questionType: "MULTIPLE_CHOICE",
        statement: "Quem ganhou a Copa do Mundo de 2014?",
        hint: "A final foi entre Alemanha e Argentina.",
        explanation: "A Alemanha ganhou a Copa do Mundo de 2014.",
        correctAnswer: 0,
        options: ["Alemanha", "Brasil", "Argentina"],
      },
      {
        id: "q2",
        questionType: "MULTIPLE_CHOICE",
        statement: "Qual é o atleta mais rápido do mundo?",
        hint: "Ele é conhecido como o 'relâmpago' e vem da Jamaica.",
        explanation: "Usain Bolt é o atleta mais rápido do mundo.",
        correctAnswer: 1,
        options: ["Michael Phelps", "Usain Bolt", "Cristiano Ronaldo"],
      },
      {
        id: "q3",
        questionType: "TRUE_FALSE",
        statement: "O futebol foi inventado no Brasil.",
        hint: "O futebol moderno tem origem na Inglaterra.",
        explanation: "O futebol foi inventado na Inglaterra, e não no Brasil.",
        correctAnswer: 1, // Falso
      },
    ],
  },
};


const QuizPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const quiz = mockQuizzes[params.id];

  if (!quiz) return <p>Quiz não encontrado.</p>;

  const [selectedOptions, setSelectedOptions] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (!isSubmitted) {
      const newSelections = [...selectedOptions];
      newSelections[questionIndex] = optionIndex;
      setSelectedOptions(newSelections);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowExplanation(true);
  };

  // Extraímos o ID do vídeo do YouTube
  const videoId = extractYouTubeVideoId(quiz.sourceUri);
  const videoThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Barra lateral */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between fixed h-full">
        <div>
          {/* Thumbnail do vídeo */}
          {videoThumbnail && (
            <img
              src={videoThumbnail}
              alt="Thumbnail do vídeo"
              className="mb-4 rounded"
            />
          )}
          
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="mt-2 text-gray-300">{quiz.description}</p>

          {/* Link para vídeo do YouTube */}
          {quiz.sourceType === "YOUTUBE_VIDEO" && quiz.sourceUri && (
            <a
              href={quiz.sourceUri}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-blue-400 hover:underline"
            >
              Assista ao vídeo 🎥
            </a>
          )}
        </div>

        {/* Botão de voltar */}
        <button
          onClick={() => router.back()}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Voltar
        </button>
      </aside>

      {/* Área principal (perguntas do quiz) */}
      <main className="ml-64 p-8 w-full">
        {quiz.questions.map((question, index) => (
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

        {/* Botão de envio */}
        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Enviar Respostas
          </button>
        )}

        {isSubmitted && (
          <p className="mt-4 text-green-400">Respostas enviadas! 🎉</p>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
