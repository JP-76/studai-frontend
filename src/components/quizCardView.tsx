import Quiz from '../types/quiz';
import { useRouter } from 'next/navigation';

const QuizCardView = ({ quiz } : {quiz: Quiz}) => {
  const router = useRouter();

  const handleDetailsClick = () => {
    router.push(`/quiz/${quiz.id}`);
  };

  return (
  <div className="card bg-base-100 w-96 shadow-xl rounded-lg">
    <div className="card-header flex justify-between rounded-t-lg p-4" style={{ backgroundColor: '#3B3B4C' }}>
      <h2 className="card-title text-white text-xl" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }} title={quiz.title}>
        {quiz.title}
      </h2>
      <div className='link link-hover flex items-center text-xs'>
        <a onClick={handleDetailsClick} className='link link-hover cursor-pointer'>Detalhes</a>
      </div>
    </div>
    <div className="card-body p-2">
      <div className="grid grid-cols-10 gap-2">
        <div className='col-span-6 h-24 p-2'>
          <p className='text-xs'>Video original: <a href={`https://www.youtube.com/watch?v=${quiz.sourceUri}`} target="_blank" rel="noopener noreferrer" className='link link-hover'>{quiz.sourceUri}</a></p>
          <p className='text-xs'>Número de Questões: {quiz.questions ? quiz.questions.length : 'N/A'}</p>
        </div>
        <div className='col-span-4 h-24 p-2 flex flex-col items-center justify-center'>
          <p className='text-xs'>Pontuação:</p>
          <p className='text-xl text-green-500'>{quiz.attempts && quiz.attempts.length > 0 ? quiz.attempts[0].score : 'N/A'}</p>
          <p className='text-xs' style={{ color: '#6C6C7B' }}>Tempo gasto:</p>
          <p className='text-xs' style={{ color: '#6C6C7B' }}>{quiz.attempts && quiz.attempts.length > 0 ? `${quiz.attempts[0].timeSpent}m` : 'N/A'}</p>
        </div>
        <div className='col-span-6 p-2'>
          <p className='text-xs' style={{ color: '#6C6C7B' }}>Criado em: {quiz.attempts && quiz.attempts.length > 0 ? new Date(quiz.attempts[0].completionDate).toLocaleDateString('pt-BR') : 'N/A'}</p>
          <p className='text-xs' style={{ color: '#6C6C7B' }}>Editado em: {quiz.attempts && quiz.attempts.length > 0 ? new Date(quiz.attempts[0].completionDate).toLocaleDateString('pt-BR') : 'N/A'}</p>
        </div>
        <div className='col-span-4 p-2 flex flex-col items-center justify-center'>
          <p className='text-xs' style={{ color: '#6C6C7B' }}>Realizado em:</p>
          <p className='text-xs' style={{ color: '#6C6C7B' }}>{quiz.attempts && quiz.attempts.length > 0 ? new Date(quiz.attempts[0].completionDate).toLocaleDateString('pt-BR') : 'N/A'}</p>
        </div>
      </div>
    </div>
  </div>
  );
};
  
export default QuizCardView;