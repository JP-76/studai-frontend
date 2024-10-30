// ReturnButton.tsx

interface ReturnButtonProps {
  onClick: () => void; // Função que será chamada ao clicar no botão
}

const ReturnButton = ({ onClick }: ReturnButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Voltar para a página inicial
    </button>
  );
};

export default ReturnButton;
