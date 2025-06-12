import axios from 'axios';
import type { QuizDTO } from '../types/Quiz';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

export async function getAllQuizzes(): Promise<QuizDTO[]> {
  const response = await fetch("/api/quizzes");
  if (!response.ok) throw new Error("Erro ao buscar quizzes");
  return response.json();
}

export const createQuiz = async (quiz: Partial<QuizDTO>) => {
  const response = await API.post<QuizDTO>('/quiz', quiz);
  return response.data;
};

export const getQuizById = async (id: string) => {
  const response = await API.get<QuizDTO>(`/quiz/${id}`);
  return response.data;
};
