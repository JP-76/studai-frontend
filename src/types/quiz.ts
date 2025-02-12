import Attempt from './attempt';
import Question from './question';

export default interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  sourceType: string;
  sourceUri: string;
  userId: string;
  attempts: Attempt[] | null;
}