export default interface Attempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  completionDate: string;
  timeSpent: number;
}