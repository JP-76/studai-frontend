'use client';
import { useState } from "react";
import InputBar from "@/components/InputBar";
import ParentComponent from "@/components/ParentComponent";
import ReturnButton from "@/components/ReturnButton";
import LogoImage from "@/components/LogoImage";

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false); // Estado para controlar a submissão

  // Função que será chamada ao enviar o input
  const handleInputSubmit = () => {
    setIsSubmitted(true); // Define como verdadeiro para ocultar a barra e mostrar o quiz
  };

  // Função para "voltar" e exibir a barra de input novamente
  const handleReturn = () => {
    setIsSubmitted(false); // Define como falso para ocultar o quiz e mostrar a barra de input
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24 bg-[#232336]">
      {!isSubmitted ? (
        <>
          <LogoImage />
          <InputBar onSubmit={handleInputSubmit} />
        </>
      ) : (
        <>
          <LogoImage />
          <div className="flex flex-col items-center">
            <ParentComponent />
            <ReturnButton onClick={handleReturn} /> {/* Botão de retornar */}
          </div>
        </>
      )}
    </main>
  );
}
