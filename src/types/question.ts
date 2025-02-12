export default interface Question  {
  id: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_OR_FALSE";
  statement: string;
  hint: string;
  explanation: string;
  correctAnswer: any;
  quizId: string;
  options: string[];
}