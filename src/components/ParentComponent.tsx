"use client";

import { useState } from "react";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";

interface quizDataInterface {
    quiz: {
      title: string,
    description: string,
    questions: {
        questionType: "TRUE_OR_FALSE" | "MULTIPLE_CHOICE",
        statement: string,
        hint: string,
        explanation: string,
        correctAnswer: number,
        options: string[]
    }[],
  }
}

const ParentComponent = ({quiz}: quizDataInterface) => {
  const [answers, setAnswers] = useState<boolean[]>([]); // Estado para armazenar as respostas
  const [showResults, setShowResults] = useState(false); // Estado para controlar a exibição das respostas
  const [selectedOptions, setSelectedOptions] = useState<(number | null)[]>([]); // Estado para armazenar as opções selecionadas
  const [showExplanation, setShowExplanation] = useState(false); // Novo estado para controlar a exibição da explicação


  //! Faz algum código para pegar as perguntas do quiz aqui
  //! Fácil se tiver salvo em variável local no InputBar.tsx

  // Dados de exemplo das perguntas
  const questionsData = quiz.questions;
 
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
        } else if (question.questionType === "TRUE_OR_FALSE") {
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
