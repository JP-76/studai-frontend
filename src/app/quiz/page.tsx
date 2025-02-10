// src/app/quiz/page.tsx

"use client";

import { useState } from "react";
import MultipleChoiceQuestion from "@/components/MultipleChoiceQuestion";
import TrueFalseQuestion from "@/components/TrueFalseQuestion";
import Link from "next/link";

const QuizPage = () => {
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  // Dados do quiz mantidos localmente
  const quiz = {
    title: "Exemplo de Quiz",
    description: "Responda as perguntas abaixo:",
    questions: [
      {
        questionType: "MULTIPLE_CHOICE",
        statement: "Qual é a capital da França?",
        hint: "É uma cidade famosa pelo amor.",
        explanation: "A capital da França é Paris.",
        correctAnswer: 0,
        options: ["Paris", "Londres", "Berlim", "Madrid"],
      },
      {
        questionType: "TRUE_OR_FALSE",
        statement: "O Sol é um planeta.",
        hint: "O Sol pertence a um sistema solar.",
        explanation: "O Sol é uma estrela, não um planeta.",
        correctAnswer: 1,
        options: [],
      },
    ],
  };

  const handleAnswerSelection = (isCorrect: boolean, questionIndex: number) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = isCorrect;
      return newAnswers;
    });
  };

  const handleOptionSelect = (optionIndex: number, questionIndex: number) => {
    setSelectedOptions((prevSelectedOptions) => {
      const newSelectedOptions = [...prevSelectedOptions];
      newSelectedOptions[questionIndex] = optionIndex;
      return newSelectedOptions;
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
    setShowExplanation(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
      <p className="mb-4">{quiz.description}</p>

      {quiz.questions.map((question, index) => (
        <div key={index} className="mb-4">
          {question.questionType === "MULTIPLE_CHOICE" ? (
            <MultipleChoiceQuestion
              question={question}
              onAnswerSelection={(isCorrect) => handleAnswerSelection(isCorrect, index)}
              showExplanation={showExplanation}
              selectedOption={selectedOptions[index]}
              onOptionSelect={(optionIndex) => handleOptionSelect(optionIndex, index)}
              isSubmitted={showResults}
            />
          ) : (
            <TrueFalseQuestion
              question={question}
              onAnswerSelection={(isCorrect) => handleAnswerSelection(isCorrect, index)}
              showExplanation={showExplanation}
              selectedOption={selectedOptions[index]}
              onOptionSelect={(optionIndex) => handleOptionSelect(optionIndex, index)}
              isSubmitted={showResults}
            />
          )}
        </div>
      ))}

      <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Enviar Respostas
      </button>

      {showResults && (
        <div className="mt-4 p-3 bg-gray-800 text-white rounded">
          <h3 className="text-lg font-semibold">Resultados:</h3>
          {answers.map((isCorrect, index) => (
            <p key={index}>Pergunta {index + 1}: {isCorrect ? "Correta" : "Incorreta"}</p>
          ))}
        </div>
      )}

      <Link href="/" className="mt-4 block text-blue-400 hover:underline">Voltar para a página inicial</Link>
    </div>
  );
};

export default QuizPage;
