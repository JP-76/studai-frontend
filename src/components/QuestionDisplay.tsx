"use client";

import { motion } from "framer-motion";
import Question from "@/types/question";

interface QuestionDisplayProps {
  question: Question;
  showExplanation: boolean;
}

const QuestionDisplay = ({ question, showExplanation }: QuestionDisplayProps) => {
  const renderOptions = () => {
    if (question.questionType === "MULTIPLE_CHOICE") {
      return (
        <div className="space-y-2">
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctAnswer;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center p-2 rounded-md ${
                  isCorrect ? "bg-green-500 text-white" : "bg-gray-800 text-gray-300"
                }`}
              >
                <span className="font-bold mx-2">{option}</span>
              </motion.div>
            );
          })}
        </div>
      );
    } else if (question.questionType === "TRUE_OR_FALSE") {
      return (
        <div className="space-y-2">
          {["Verdadeiro", "Falso"].map((option, index) => {
            const isCorrect = index === question.correctAnswer;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center p-2 rounded-md ${
                  isCorrect ? "bg-green-500 text-white" : "bg-gray-800 text-gray-300"
                }`}
              >
                <span className="font-bold mx-2">{option}</span>
              </motion.div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 bg-[#12121B] rounded-xl w-full max-w-[400px] relative mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-white text-xl font-bold mb-2">{question.statement}</h2>
      </div>

      {renderOptions()}

      {showExplanation && (
        <div className="mt-4 p-3 bg-gray-900 rounded-md text-gray-300">
          <h3 className="text-lg font-semibold">Explicação:</h3>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
