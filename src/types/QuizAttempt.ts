export interface QuizAttemptAnswerDTO {
  id: string;
  attemptId: string;
  questionId: string;
  answer: string;
  correct: boolean;
}

export interface QuizAttemptDTO {
  id: string;
  quizId: string;
  score: number;
  timeSpent: number;
  guestUser: boolean;
  guestName: string;
  answers: QuizAttemptAnswerDTO[];
  createdAt: string;
}

export interface QuizAttemptCreateDTO {
  quizId: string;
  timeSpent: number;
  guestUser: boolean;
  guestName: string;
  answers: Record<string, string>; // key: questionId, value: user answer
}
