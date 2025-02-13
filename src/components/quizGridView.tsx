import QuizCardView from './quizCardView';
import Quiz from '../types/quiz';

const QuizGridView = ({ quizzes }: { quizzes: Quiz[]}) => {
  if(quizzes.length === 0) {
    return <div className='text-xl h-full pt-60' style={{ color: '#6C6C7B' }}>Nenhum quiz encontrado</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {quizzes.map((quiz, index) => (
        <QuizCardView key={index} quiz={quiz} />
      ))}
    </div>
  );
};

export default QuizGridView;
