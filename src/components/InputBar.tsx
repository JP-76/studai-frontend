"use client";

import { useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Função para validar a URL do YouTube
const validateYouTubeUrl = async (videoID: string): Promise<boolean> => {
  try {
    const url = `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${videoID}`;

    const response = await fetch(url);

    return response.ok;
  } catch (error) {
    console.error("Erro ao validar o vídeo do YouTube:", error);
    return false;
  }
};

// Função para extrair o videoID de uma URL do YouTube
const extractYouTubeVideoID = (url: string): string | null => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const InputBar = () => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Função para enviar o valor
  const handleSend = async () => {
    const videoID = extractYouTubeVideoID(inputValue);

    if (videoID) {
      const isValid = await validateYouTubeUrl(videoID);

      if (isValid) {
        console.log("URL válida do YouTube:", inputValue);
        console.log("ID do vídeo:", videoID);
        //================================================================================================
        //
        //                  Aqui vai a lógica para enviar o ID do vídeo para a API
        //
        //================================================================================================
      } else {
        toast.warn("URL inválida do YouTube. Por favor, tente novamente.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } else {
      toast.error("A URL fornecida não é um link válido do YouTube.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  // Função para capturar a tecla Enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="relative w-3/5 max-w-[720px] min-w-80 h-16">
      <div className="flex items-center w-full h-full bg-[#12121B] rounded-2xl">
        <input
          type="text"
          placeholder="e.g.: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          maxLength={50}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent text-[#DBDEE0] font-inter font-normal text-base leading-5 pl-4 outline-none"
        />
        <div className="flex-shrink-0 pr-4">
          <button className="h-8 w-8" onClick={handleSend}>
            <Image
              src="/send.svg"
              width={32}
              height={32}
              alt="Send Icon"
            ></Image>
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default InputBar;
