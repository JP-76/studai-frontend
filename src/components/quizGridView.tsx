import QuizCardView from './quizCardView';
import Quiz from '../types/quiz';

interface QuizGridViewProps {
  quizzes: Quiz[];
}

const QuizGridView = ({ quizzes }: QuizGridViewProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {quizzes.map((quiz, index) => (
        <QuizCardView key={index} quiz={quiz} />
      ))}
    </div>
  );
};

export default QuizGridView;
