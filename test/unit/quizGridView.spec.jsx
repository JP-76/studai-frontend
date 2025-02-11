import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import QuizGridView from '@/components/quizGridView';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));


const quizzes = [
  {
    title: 'Quiz 1',
    videoLink: 'dQw4w9WgXcQ',
    questionCount: '10',
    score: '80',
    timeSpent: '10m',
    createdAt: '2023-01-01',
    editedAt: '2023-01-02',
    takenAt: '2023-01-03'
  },
  {
    title: 'Quiz 2',
    videoLink: 'eYq7WapuDLU',
    questionCount: '15',
    score: '90',
    timeSpent: '15m',
    createdAt: '2023-02-01',
    editedAt: '2023-02-02',
    takenAt: '2023-02-03'
  }
];

describe('QuizGridView Component', () => {
  it('renderiza corretamente com quizzes', () => {
    render(<QuizGridView quizzes={quizzes} />);
    
    expect(screen.getByText('Quiz 1')).toBeInTheDocument();
    expect(screen.getByText('Quiz 2')).toBeInTheDocument();
  });

  it('exibe mensagem quando não há quizzes', () => {
    render(<QuizGridView quizzes={[]} />);
    
    expect(screen.getByText('Nenhum quiz encontrado')).toBeInTheDocument();
  });
});
