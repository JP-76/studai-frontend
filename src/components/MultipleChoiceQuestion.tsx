// MultipleChoiceQuestion.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiHelpCircle } from "react-icons/fi";
import { motion } from "framer-motion"; // Importando framer-motion

// Interface para a estrutura da questão
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
  onAnswerSelection: (isCorrect: boolean) => void; // Prop para a função de callback
  showExplanation: boolean; // Novo prop para controlar a exibição da explicação
  selectedOption: number | null; // Prop para receber a opção selecionada do pai
  onOptionSelect: (optionIndex: number) => void; // Função para lidar com a seleção de opção
  isSubmitted: boolean; // Novo prop para indicar se o envio foi feito
}

// Função para exibir a questão de múltipla escolha
const MultipleChoiceQuestion = ({
  question,
  onAnswerSelection,
  showExplanation,
  selectedOption,
  onOptionSelect,
  isSubmitted,
}: MultipleChoiceQuestionProps) => {
  const [showHint, setShowHint] = useState<boolean>(false); // Estado para controlar a exibição da dica
  const hintRef = useRef<HTMLDivElement | null>(null); // Referência para o overlay da dica

  // Função para selecionar uma opção
  const handleOptionSelect = (index: number) => {
    if (!isSubmitted) {
      // Verifica se o envio foi feito
      onOptionSelect(index); // Notifica o pai sobre a seleção
      const isCorrect = index === question.correctAnswer; // Verifica se a opção selecionada é correta
      onAnswerSelection(isCorrect); // Chama a função de callback passando se a resposta é correta
    }
  };

  // Alfabeto para as opções
  const alphabet = ["A", "B", "C", "D", "E", "F"];

  // Manipulador de evento para fechar o overlay quando clicar fora
  const handleClickOutside = (event: MouseEvent) => {
    if (hintRef.current && !hintRef.current.contains(event.target as Node)) {
      setShowHint(false);
    }
  };

  // Adiciona e remove o manipulador de evento para clicks fora
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 bg-[#12121B] rounded-xl w-full max-w-[600px] relative mb-4"> {/* Adicionei margin-bottom */}
      <div className="flex justify-between items-center">
        <h2 className="text-white text-xl font-bold mb-2">
          {question.statement}
        </h2>

        {/* Container relativo para posicionar o botão e o overlay */}
        <div className="relative" ref={hintRef}>
          {/* Botão redondo menor com ícone de interrogação maior */}
          <button
            onClick={() => setShowHint((prev) => !prev)}
            className="flex items-center justify-center w-11 h-7 bg-blue-500 text-white rounded-xl -mt-2"
          >
            Dica
          </button>

          {/* Dica que aparece como uma janela flutuante abaixo do botão */}
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
              onClick={() => handleOptionSelect(index)}
            >
              {/* Círculo para a seleção */}
              <div className="flex items-center justify-center h-6 w-6 border-2 border-gray-300 rounded-full mr-2">
                {isSelected && (
                  <div className="h-3 w-3 bg-white rounded-full"></div>
                )}
              </div>
              {/* Nomeação da opção com letras */}
              <span className="font-bold mr-2">{alphabet[index]}.</span>
              {/* Texto da opção */}
              <span>{option}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Mostrar a explicação somente se showExplanation for true */}
      {showExplanation && (
        <div className="mt-4 p-3 bg-gray-900 rounded-md text-gray-300">
          <h3 className="text-lg font-semibold">Explicação:</h3>
          <p>{question.explanation}</p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default MultipleChoiceQuestion;
