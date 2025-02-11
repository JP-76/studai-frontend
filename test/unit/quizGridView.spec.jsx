import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import QuizGridView from '@/components/quizGridView';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const quizzes = [
  {
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
  },
  {
    id: '2',
    title: 'Quiz 2',
    description: 'Descrição do Quiz 2',
    questions: [],
    sourceType: 'YouTube',
    sourceUri: 'eYq7WapuDLU',
    userId: 'user2',
    attempts: [
      {
        id: 'attempt2',
        quizId: '2',
        userId: 'user2',
        score: 90,
        completionDate: '2023-02-01',
        timeSpent: 15,
      }
    ]
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
