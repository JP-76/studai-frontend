"use client";

import { useState } from "react";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";

const ParentComponent = () => {
  const [answers, setAnswers] = useState<boolean[]>([]); // Estado para armazenar as respostas
  const [showResults, setShowResults] = useState(false); // Estado para controlar a exibição das respostas
  const [selectedOptions, setSelectedOptions] = useState<(number | null)[]>([]); // Estado para armazenar as opções selecionadas
  const [showExplanation, setShowExplanation] = useState(false); // Novo estado para controlar a exibição da explicação

  // Dados de exemplo das perguntas
  const questionsData = [
    {
      questionType: "MULTIPLE_CHOICE",
      statement: "Qual é a capital da Alemanha?",
      hint: "É também a maior cidade do país.",
      explanation: "A capital da Alemanha é Berlim.",
      correctAnswer: 0,
      options: ["Berlim", "Munique", "Frankfurt", "Hamburgo"],
    },
    {
      questionType: "MULTIPLE_CHOICE",
      statement: "Qual é o maior planeta do sistema solar?",
      hint: "Ele é conhecido por suas grandes tempestades.",
      explanation: "Júpiter é o maior planeta do sistema solar.",
      correctAnswer: 2,
      options: ["Marte", "Terra", "Júpiter", "Saturno"],
    },
    {
      questionType: "MULTIPLE_CHOICE",
      statement: "Quem escreveu 'Dom Casmurro'?",
      hint: "Ele é um autor famoso do Realismo brasileiro.",
      explanation: "Machado de Assis escreveu 'Dom Casmurro'.",
      correctAnswer: 1,
      options: [
        "José de Alencar",
        "Machado de Assis",
        "Érico Veríssimo",
        "Clarice Lispector",
      ],
    },
    {
      questionType: "TRUE_FALSE",
      statement: "A água ferve a 100 graus Celsius ao nível do mar.",
      hint: "Pense sobre o que acontece quando você ferve água.",
      explanation: "Sim, a água ferve a 100 graus Celsius ao nível do mar.",
      correctAnswer: 0,
    },
    {
      questionType: "TRUE_FALSE",
      statement: "Os seres humanos têm três pulmões.",
      hint: "Quantos pulmões você acha que temos?",
      explanation: "Falso, os seres humanos têm dois pulmões.",
      correctAnswer: 1,
    },
    {
      questionType: "TRUE_FALSE",
      statement: "A Austrália é o único país que é também um continente.",
      hint: "É uma informação geográfica interessante.",
      explanation:
        "Verdadeiro, a Austrália é o único país que também é um continente.",
      correctAnswer: 0,
    },
  ];

  // Função para lidar com a seleção de resposta
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

    // Rolar para o topo suavemente
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="p-4">
      {questionsData.map((question, index) => {
        const questionSpacing = "mb-4"; // Classe para margem inferior

        if (question.questionType === "MULTIPLE_CHOICE" && question.options) {
          return (
            <div className={questionSpacing} key={index}>
              <MultipleChoiceQuestion
                question={question}
                onAnswerSelection={(isCorrect) =>
                  handleAnswerSelection(isCorrect, index)
                }
                showExplanation={showExplanation}
                selectedOption={selectedOptions[index]}
                onOptionSelect={(optionIndex) =>
                  handleOptionSelect(optionIndex, index)
                }
                isSubmitted={showResults}
              />
            </div>
          );
        } else if (question.questionType === "TRUE_FALSE") {
          return (
            <div className={questionSpacing} key={index}>
              <TrueFalseQuestion
                question={question}
                onAnswerSelection={(isCorrect) =>
                  handleAnswerSelection(isCorrect, index)
                }
                showExplanation={showExplanation}
                selectedOption={selectedOptions[index]}
                onOptionSelect={(optionIndex) =>
                  handleOptionSelect(optionIndex, index)
                }
                isSubmitted={showResults}
              />
            </div>
          );
        }
        return null;
      })}

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded transition duration-300 hover:bg-blue-600"
      >
        Enviar Respostas
      </button>

      {showResults && (
        <div className="mt-4 p-3 bg-gray-800 text-white rounded">
          <h3 className="text-lg font-semibold">Resultados:</h3>
          {answers.map((isCorrect, index) => (
            <p key={index}>
              Pergunta {index + 1}: {isCorrect ? "Correta" : "Incorreta"}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentComponent;
