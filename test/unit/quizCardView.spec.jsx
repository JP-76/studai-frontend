import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizCardView from '@/components/quizCardView';
import { useRouter } from 'next/navigation';

// Mock do useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const quiz = {
  id: '1',
  title: 'Quiz 1',
  description: 'Descrição do Quiz 1',
  questions: [],
  sourceType: 'YouTube',
  sourceUri: 'dQw4w9WgXcQ',
  userId: 'user1',
  attempts: [
    {
      id: 'attempt1',
      quizId: '1',
      userId: 'user1',
      score: 80,
      completionDate: '2023-01-01',
      timeSpent: 10,
    }
  ]
};

describe('QuizCardView Component', () => {
  it('renderiza corretamente', () => {
    render(<QuizCardView quiz={quiz} />);
    
    expect(screen.getByText(quiz.title)).toBeInTheDocument();
    expect(screen.getByText('Video original:')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'a' && content.includes(quiz.sourceUri);
    })).toBeInTheDocument();
    expect(screen.getByText(`Número de Questões: ${quiz.questions.length}`)).toBeInTheDocument();
    expect(screen.getByText(quiz.attempts[0].score.toString())).toBeInTheDocument();
    expect(screen.getByText('Tempo gasto:')).toBeInTheDocument();
    expect(screen.getByText(`${quiz.attempts[0].timeSpent}m`)).toBeInTheDocument();
    expect(screen.getByText(`Criado em: ${quiz.attempts[0].completionDate}`)).toBeInTheDocument();
    expect(screen.getByText(`Editado em: ${quiz.attempts[0].completionDate}`)).toBeInTheDocument();
    expect(screen.getByText('Realizado em:')).toBeInTheDocument();
    expect(screen.getByText(quiz.attempts[0].completionDate)).toBeInTheDocument();
  });

  it('navega para a página de detalhes ao clicar no link de detalhes', () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });

    render(<QuizCardView quiz={quiz} />);
    
    const detailsLink = screen.getByText('Detalhes');
    fireEvent.click(detailsLink);

    expect(push).toHaveBeenCalledWith(`/quiz/${quiz.id}`);
  });

  it('verifica se o link do vídeo original está presente e se possui o atributo href correto', () => {
    render(<QuizCardView quiz={quiz} />);
    
    const videoLink = screen.getByText(quiz.sourceUri);
    expect(videoLink.closest('a')).toHaveAttribute('href', `https://www.youtube.com/watch?v=${quiz.sourceUri}`);
  });
});
