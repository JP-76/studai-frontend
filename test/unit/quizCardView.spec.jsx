import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizCardView from '@/components/quizCardView';
import { useRouter } from 'next/navigation';

// Mock do useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const quiz = {
  title: 'Quiz 1',
  videoLink: 'dQw4w9WgXcQ',
  questionCount: '10',
  score: '80',
  timeSpent: '10m',
  createdAt: '2023-01-01',
  editedAt: '2023-01-02',
  takenAt: '2023-01-03'
};

describe('QuizCardView Component', () => {
  it('renderiza corretamente', () => {
    render(<QuizCardView quiz={quiz} />);
    
    expect(screen.getByText(quiz.title)).toBeInTheDocument();
    expect(screen.getByText('Video original:')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'a' && content.includes(quiz.videoLink);
    })).toBeInTheDocument();
    expect(screen.getByText(`Número de Questões: ${quiz.questionCount}`)).toBeInTheDocument();
    expect(screen.getByText(quiz.score)).toBeInTheDocument();
    expect(screen.getByText('Tempo gasto:')).toBeInTheDocument();
    expect(screen.getByText(quiz.timeSpent)).toBeInTheDocument();
    expect(screen.getByText(`Criado em: ${quiz.createdAt}`)).toBeInTheDocument();
    expect(screen.getByText(`Editado em: ${quiz.editedAt}`)).toBeInTheDocument();
    expect(screen.getByText('Realizado em:')).toBeInTheDocument();
    expect(screen.getByText(quiz.takenAt)).toBeInTheDocument();
  });

  it('navega para a página de detalhes ao clicar no link de detalhes', () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });

    render(<QuizCardView quiz={quiz} />);
    
    const detailsLink = screen.getByText('Detalhes');
    fireEvent.click(detailsLink);

    expect(push).toHaveBeenCalledWith(`/quiz-detalhes/${quiz.videoLink}`);
  });

  it('verifica se o link do vídeo original está presente e se possui o atributo href correto', () => {
    render(<QuizCardView quiz={quiz} />);
    
    const videoLink = screen.getByText(quiz.videoLink);
    expect(videoLink.closest('a')).toHaveAttribute('href', `https://www.youtube.com/watch?v=${quiz.videoLink}`);
  });
});
