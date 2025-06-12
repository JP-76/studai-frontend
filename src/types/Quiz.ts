export interface QuizQuestionDTO {
  id: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_OR_FALSE';
  statement: string;
  hint: string;
  explanation: string;
  correctAnswer: string;
  quizId: string;
  options: string[];
}

export interface QuizDTO {
  id: string;
  userId: string;
  title: string;
  description: string;
  languageCode: 'EN' | 'PT';
  sourceType: 'YOUTUBE_VIDEO' | 'FILE_UPLOAD' | 'PROMPT_BASED';
  sourceContent: string;
  questions: QuizQuestionDTO[];
  createdAt: string;
  updatedAt: string;
}
