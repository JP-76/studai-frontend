"use client";

import { useState, useEffect, useRef } from "react";
import Question from "@/types/question";

interface QuestionEditProps {
  question: Question;
  onSave: (updatedQuestion: Question) => void;
}

const QuestionEdit = ({ question, onSave }: QuestionEditProps) => {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);
  const [showHint, setShowHint] = useState<boolean>(false);

  const previousQuestionRef = useRef<Question>(question);

  useEffect(() => {
    if (
      JSON.stringify(previousQuestionRef.current) !==
      JSON.stringify(editedQuestion)
    ) {
      onSave(editedQuestion);
      previousQuestionRef.current = editedQuestion;
    }
  }, [editedQuestion, onSave]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...editedQuestion.options];
    updatedOptions[index] = value;
    setEditedQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const handleCorrectAnswerChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;

    if (editedQuestion.questionType === "MULTIPLE_CHOICE") {
      const index = value.charCodeAt(0) - 65; // Convertendo a letra (A, B, C...) para número (0, 1, 2...)
      setEditedQuestion((prev) => ({
        ...prev,
        correctAnswer: String(index),
      }));
    } else if (editedQuestion.questionType === "TRUE_OR_FALSE") {
      // Para verdadeiro ou falso, converte para "true" ou "false" antes de salvar
      setEditedQuestion((prev) => ({
        ...prev,
        correctAnswer: value === "Verdadeiro" ? "true" : "false",
      }));
    }
  };

  const renderOptions = () => {
    if (editedQuestion.questionType === "MULTIPLE_CHOICE") {
      return (
        <div className="space-y-2">
          {editedQuestion.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const isCorrect = String(index) === editedQuestion.correctAnswer;

            return (
              <div
                key={index}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                  isCorrect ? "bg-green-500 text-white" : "bg-gray-800 text-gray-300"
                }`}
              >
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            );
          })}
        </div>
      );
    } else if (editedQuestion.questionType === "TRUE_OR_FALSE") {
      return (
        <div className="space-y-2">
          {["Verdadeiro", "Falso"].map((option, index) => {
            const isCorrect =
              (index === 0 && editedQuestion.correctAnswer === "true") ||
              (index === 1 && editedQuestion.correctAnswer === "false");

            return (
              <div
                key={index}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                  isCorrect ? "bg-green-500 text-white" : "bg-gray-800 text-gray-300"
                }`}
              >
                <input
                  type="text"
                  name={`option-${index}`}
                  value={option}
                  readOnly
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 bg-[#12121B] rounded-xl w-full max-w-[600px] relative mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-white text-xl font-bold mb-2">Editar Questão</h2>
        <div className="relative">
          {showHint && (
            <div className="absolute left-0 top-10 bg-gray-800 text-white p-2 rounded-md shadow-lg z-10 w-64">
              {editedQuestion.hint}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-gray-300 font-semibold">Enunciado:</label>
        <textarea
          name="statement"
          value={editedQuestion.statement}
          onChange={handleInputChange}
          className="w-full p-2 mt-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none"
        />
      </div>

      <div className="mt-4">
        <label className="text-gray-300 font-semibold">Alternativas:</label>
        {renderOptions()}
      </div>

      <div className="mt-4">
        <label className="text-gray-300 font-semibold">
          Alternativa correta:
        </label>
        <select
          value={
            editedQuestion.questionType === "MULTIPLE_CHOICE"
              ? String.fromCharCode(65 + parseInt(editedQuestion.correctAnswer || "0"))
              : editedQuestion.correctAnswer === "true"
              ? "Verdadeiro"
              : "Falso"
          }
          onChange={handleCorrectAnswerChange}
          className="w-full p-2 mt-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none"
        >
          {editedQuestion.questionType === "MULTIPLE_CHOICE"
            ? Array.from(
                { length: editedQuestion.options.length },
                (_, index) => String.fromCharCode(65 + index)
              ).map((letter, index) => (
                <option key={index} value={letter}>
                  {letter}
                </option>
              ))
            : ["Verdadeiro", "Falso"].map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="text-gray-300 font-semibold">Dica:</label>
        <textarea
          name="hint"
          value={editedQuestion.hint}
          onChange={handleInputChange}
          className="w-full p-2 mt-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none"
        />
      </div>

      <div className="mt-4">
        <label className="text-gray-300 font-semibold">Explicação:</label>
        <textarea
          name="explanation"
          value={editedQuestion.explanation}
          onChange={handleInputChange}
          className="w-full p-2 mt-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none h-32"
        />
      </div>
    </div>
  );
};

export default QuestionEdit;
