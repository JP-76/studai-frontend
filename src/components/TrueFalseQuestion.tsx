// TrueFalseQuestion.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { FiHelpCircle } from "react-icons/fi";
import { motion } from "framer-motion"; // Importando framer-motion

// Interface para a estrutura da questão
interface Question {
  questionType: string;
  statement: string;
  hint: string;
  explanation: string;
  correctAnswer: number; // 0 para Verdadeiro, 1 para Falso
}

interface TrueFalseQuestionProps {
  question: Question;
  onAnswerSelection: (isCorrect: boolean) => void;
  showExplanation: boolean;
  selectedOption: number | null;
  onOptionSelect: (optionIndex: number) => void;
  isSubmitted: boolean;
}

const TrueFalseQuestion = ({
  question,
  onAnswerSelection,
  showExplanation,
  selectedOption,
  onOptionSelect,
  isSubmitted,
}: TrueFalseQuestionProps) => {
  const [showHint, setShowHint] = useState<boolean>(false);
  const hintRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (hintRef.current && !hintRef.current.contains(event.target as Node)) {
      setShowHint(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 bg-[#12121B] rounded-xl w-full max-w-[600px] relative mb-4"> {/* Adicionei margin-bottom */}
      <div className="flex justify-between items-center">
        <h2 className="text-white text-xl font-bold mb-2">{question.statement}</h2>
        <div className="relative" ref={hintRef}>
          <button
            onClick={() => setShowHint((prev) => !prev)}
            className="flex items-center justify-center w-11 h-7 bg-blue-500 text-white rounded-xl -mt-2"
          >
            Dica
          </button>
          {showHint && (
            <div className="absolute left-0 top-10 bg-gray-800 text-white p-2 rounded-md shadow-lg z-10 w-64">
              {question.hint}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {["Falso", "Verdadeiro"].map((option, index) => {
          const isCorrect = index ===  question.correctAnswer;
          const isSelected = selectedOption === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }} // Animação inicial
              animate={{ opacity: 1, y: 0 }} // Animação ao aparecer
              exit={{ opacity: 0, y: -10 }} // Animação ao sair
              transition={{ duration: 0.3 }} // Duração da animação
              className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                isSubmitted
                  ? isCorrect
                    ? "bg-green-500 text-white" // Cor verde para a resposta correta
                    : isSelected
                    ? "bg-red-500 text-white" // Cor vermelha para a resposta errada
                    : "bg-gray-800 text-gray-300"
                  : "bg-gray-800 text-gray-300"
              }`}
              onClick={() => {
                if (!isSubmitted) {
                  onOptionSelect(index);
                  onAnswerSelection(isCorrect);
                }
              }}
            >
              <div className="flex items-center justify-center h-6 w-6 border-2 border-gray-300 rounded-full mr-2">
                {isSelected && (
                  <div className="h-3 w-3 bg-white rounded-full"></div>
                )}
              </div>
              <span className="font-bold mr-2">{option}</span>
            </motion.div>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mt-4 p-3 bg-gray-900 rounded-md text-gray-300">
          <h3 className="text-lg font-semibold">Explicação:</h3>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default TrueFalseQuestion;
