// InputBar.tsx

import { useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";


const quantQuestions = 10;

const apiUrl = process.env.NEXT_PUBLIC_GPT_URL;


interface InputBarProps {
  onSubmit: () => void; // Função que será chamada ao enviar o input
  handleQuiz: (quiz: any) => void; // TODO !!!!!!! ADICIONAR UMA INTERFACE !!!!!!!!!!!
}

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
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const InputBar = ({ onSubmit, handleQuiz }: InputBarProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSend = async () => {
    const videoID = extractYouTubeVideoID(inputValue);

    if (videoID) {
      const isValid = await validateYouTubeUrl(videoID);

      if (isValid) {
        onSubmit();

        // ============================================================
        //! Aqui precisa ir o código de envio do videoID para a API
        //! Pode salvar o quiz retornado em variável local para pegar no componente ParentComponent

        const quiz = await axios.post(`${apiUrl}/quiz?videoId=${videoID}&questions=${quantQuestions}`)
              .then((quiz) => {
                handleQuiz(quiz.data)
                console.log(quiz.data);
              });

        
        
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
          placeholder="Ex.: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
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
              width={24}
              height={24}
              alt="Send Icon"
            />
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default InputBar;
