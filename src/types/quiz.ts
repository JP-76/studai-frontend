export interface QuizQuestion {
  id: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_OR_FALSE";
  statement: string;
  hint: string;
  explanation: string;
  correctAnswer: string;
  quizId: string;
  options: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  languageCode: string;
  sourceType: "YOUTUBE_VIDEO" | "PROMPT_BASED";
  sourceContent: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
}

export interface QuizSubmission {
  quizId: string;
  visitorName?: string;
  answers: QuizAnswer[];
}
