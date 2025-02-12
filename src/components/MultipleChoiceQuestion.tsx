"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Question {
  questionType: string;
  statement: string;
  hint: string;
  explanation: string;
  correctAnswer: number;
  options: string[];
}

interface MultipleChoiceQuestionProps {
  question: Question;
  onAnswerSelection: (isCorrect: boolean) => void;
  showExplanation: boolean;
  selectedOption: number | null;
  onOptionSelect: (optionIndex: number) => void;
  isSubmitted: boolean;
}

const MultipleChoiceQuestion = ({
  question,
  onAnswerSelection,
  showExplanation,
  selectedOption,
  onOptionSelect,
  isSubmitted,
}: MultipleChoiceQuestionProps) => {
  const [showHint, setShowHint] = useState<boolean>(false);
  const hintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hintRef.current && !hintRef.current.contains(event.target as Node)) {
        setShowHint(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 bg-[#12121B] rounded-xl w-full max-w-[600px] relative mb-4">
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
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctAnswer;
          const isSelected = selectedOption === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                isSubmitted
                  ? isCorrect
                    ? "bg-green-500 text-white"
                    : isSelected
                    ? "bg-red-500 text-white"
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
                {isSelected && <div className="h-3 w-3 bg-white rounded-full"></div>}
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

export default MultipleChoiceQuestion;
