import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TrueFalseQuestion from '@/components/TrueFalseQuestion';

// Mock de funções
const mockOnAnswerSelection = jest.fn();
const mockOnOptionSelect = jest.fn();

// Definição do objeto de questão para passar como prop
const question = {
  questionType: 'trueFalse',
  statement: 'A Terra é plana?',
  hint: 'Essa é uma pergunta popular, mas a resposta está na ciência.',
  explanation: 'A Terra é um esferoide oblato, ou seja, quase esférica, mas não completamente plana.',
  correctAnswer: 0, // 0 para Verdadeiro
};

describe('TrueFalseQuestion Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('renderiza corretamente a questão e as opções', () => {
    render(
      <TrueFalseQuestion
        question={question}
        onAnswerSelection={mockOnAnswerSelection}
        showExplanation={false}
        selectedOption={null}
        onOptionSelect={mockOnOptionSelect}
        isSubmitted={false}
      />
    );

    // Verificar se o enunciado e as opções são renderizadas corretamente
    expect(screen.getByText('A Terra é plana?')).toBeInTheDocument();
    expect(screen.getByText('Verdadeiro')).toBeInTheDocument();
    expect(screen.getByText('Falso')).toBeInTheDocument();
  });

  it('chama onOptionSelect ao clicar em uma opção', () => {
    render(
      <TrueFalseQuestion
        question={question}
        onAnswerSelection={mockOnAnswerSelection}
        showExplanation={false}
        selectedOption={null}
        onOptionSelect={mockOnOptionSelect}
        isSubmitted={false}
      />
    );

    // Clicar na opção "Verdadeiro"
    fireEvent.click(screen.getByText('Verdadeiro'));

    // Verificar se onOptionSelect foi chamado com o índice da opção selecionada
    expect(mockOnOptionSelect).toHaveBeenCalledWith(0); // Índice de "Verdadeiro"
  });

  it('chama onAnswerSelection com a resposta correta após enviar', () => {
    render(
      <TrueFalseQuestion
        question={question}
        onAnswerSelection={mockOnAnswerSelection}
        showExplanation={false}
        selectedOption={0} // Simulando que "Verdadeiro" foi selecionada
        onOptionSelect={mockOnOptionSelect}
        isSubmitted={true}
      />
    );

    // Verificar se onAnswerSelection é chamada com 'true' para a resposta correta
    expect(mockOnAnswerSelection).toHaveBeenCalledWith(true); // "Verdadeiro" é a resposta correta
  });

  it('exibe a dica ao clicar no botão "Dica"', () => {
    render(
      <TrueFalseQuestion
        question={question}
        onAnswerSelection={mockOnAnswerSelection}
        showExplanation={false}
        selectedOption={null}
        onOptionSelect={mockOnOptionSelect}
        isSubmitted={false}
      />
    );

    // Verificar se a dica não está visível inicialmente
    expect(screen.queryByText('Essa é uma pergunta popular, mas a resposta está na ciência.')).not.toBeInTheDocument();

    // Clicar no botão "Dica"
    fireEvent.click(screen.getByText('Dica'));

    // Verificar se a dica aparece
    expect(screen.getByText('Essa é uma pergunta popular, mas a resposta está na ciência.')).toBeInTheDocument();
  });

  it('não permite selecionar opções após envio', () => {
    render(
      <TrueFalseQuestion
        question={question}
        onAnswerSelection={mockOnAnswerSelection}
        showExplanation={false}
        selectedOption={null}
        onOptionSelect={mockOnOptionSelect}
        isSubmitted={true} // Enviado
      />
    );

    // Tentar selecionar uma opção após o envio
    fireEvent.click(screen.getByText('Falso'));

    // Verificar se a função onOptionSelect não foi chamada
    expect(mockOnOptionSelect).not.toHaveBeenCalled();
  });

  it('exibe a explicação quando showExplanation é verdadeiro', () => {
    render(
      <TrueFalseQuestion
        question={question}
        onAnswerSelection={mockOnAnswerSelection}
        showExplanation={true}
        selectedOption={null}
        onOptionSelect={mockOnOptionSelect}
        isSubmitted={false}
      />
    );

    // Verificar se a explicação é exibida
    expect(screen.getByText('Explicação:')).toBeInTheDocument();
    expect(screen.getByText('A Terra é um esferoide oblato, ou seja, quase esférica, mas não completamente plana.')).toBeInTheDocument();
  });
});
