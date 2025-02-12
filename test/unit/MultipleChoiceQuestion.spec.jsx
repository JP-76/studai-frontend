import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import MultipleChoiceQuestion from '@/components/MultipleChoiceQuestion';
import { toast } from 'react-toastify';

// Mock de funções
const mockOnAnswerSelection = jest.fn();
const mockOnOptionSelect = jest.fn();

// Definição do objeto de questão para passar como prop
const question = {
  questionType: 'multipleChoice',
  statement: 'Qual é a capital da França?',
  hint: 'É uma cidade famosa pela Torre Eiffel.',
  explanation: 'A capital da França é Paris, conhecida pela Torre Eiffel.',
  correctAnswer: 1,
  options: ['Londres', 'Paris', 'Roma', 'Berlim'],
};

describe('MultipleChoiceQuestion Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('renderiza corretamente a questão e as opções', () => {
    render(
      <MultipleChoiceQuestion
        question={question}
        onAnswerSelection={mockOnAnswerSelection}
        showExplanation={false}
        selectedOption={null}
        onOptionSelect={mockOnOptionSelect}
        isSubmitted={false}
      />
    );

    // Verificar se o enunciado e as opções são renderizadas corretamente
    expect(screen.getByText('Qual é a capital da França?')).toBeInTheDocument();
    expect(screen.getByText('Londres')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Roma')).toBeInTheDocument();
    expect(screen.getByText('Berlim')).toBeInTheDocument();
  });

  it('chama onOptionSelect ao clicar em uma opção', () => {
    render(
      <MultipleChoiceQuestion
        question={question}
        onAnswerSelection={mockOnAnswerSelection}
        showExplanation={false}
        selectedOption={null}
        onOptionSelect={mockOnOptionSelect}
        isSubmitted={false}
      />
    );

    // Clicar na opção "Paris"
    fireEvent.click(screen.getByText('Paris'));

    // Verificar se onOptionSelect foi chamado com o índice da opção selecionada
    expect(mockOnOptionSelect).toHaveBeenCalledWith(1); // Índice de "Paris"
  });

  it('chama onAnswerSelection com a resposta correta após enviar', () => {
    render(
      <MultipleChoiceQuestion
        question={question}
        onAnswerSelection={mockOnAnswerSelection}
        showExplanation={false}
        selectedOption={1} // Simulando que "Paris" foi selecionada
        onOptionSelect={mockOnOptionSelect}
        isSubmitted={true}
      />
    );

    // Verificar se onAnswerSelection é chamada com 'true' para a resposta correta
    expect(mockOnAnswerSelection).toHaveBeenCalledWith(true); // "Paris" é a resposta correta
  });

  it('exibe a dica ao clicar no botão "Dica"', () => {
    render(
      <MultipleChoiceQuestion
        question={question}
        onAnswerSelection={mockOnAnswerSelection}
        showExplanation={false}
        selectedOption={null}
        onOptionSelect={mockOnOptionSelect}
        isSubmitted={false}
      />
    );

    // Verificar se a dica não está visível inicialmente
    expect(screen.queryByText('É uma cidade famosa pela Torre Eiffel.')).not.toBeInTheDocument();

    // Clicar no botão "Dica"
    fireEvent.click(screen.getByText('Dica'));

    // Verificar se a dica aparece
    expect(screen.getByText('É uma cidade famosa pela Torre Eiffel.')).toBeInTheDocument();
  });

  it('não permite selecionar opções após envio', () => {
    render(
      <MultipleChoiceQuestion
        question={question}
        onAnswerSelection={mockOnAnswerSelection}
        showExplanation={false}
        selectedOption={null}
        onOptionSelect={mockOnOptionSelect}
        isSubmitted={true} // Enviado
      />
    );

    // Tentar selecionar uma opção após o envio
    fireEvent.click(screen.getByText('Londres'));

    // Verificar se a função onOptionSelect não foi chamada
    expect(mockOnOptionSelect).not.toHaveBeenCalled();
  });

  it('exibe a explicação quando showExplanation é verdadeiro', () => {
    render(
      <MultipleChoiceQuestion
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
    expect(screen.getByText('A capital da França é Paris, conhecida pela Torre Eiffel.')).toBeInTheDocument();
  });
});
