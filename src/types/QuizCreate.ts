export interface QuizCreateDTO {
  questionsQuantity: number;
  sourceContent: string;
  sourceType: 'YOUTUBE_VIDEO' | 'FILE_UPLOAD' | 'PROMPT_BASED';
  languageCode: 'EN' | 'PT';
}
