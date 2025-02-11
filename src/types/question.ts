export default interface Question  {
  id: string;
  questionType: string;
  statement: string;
  hint: string;
  explanation: string;
  correctAnswer: any;
  quizId: string;
  options: string[];
}