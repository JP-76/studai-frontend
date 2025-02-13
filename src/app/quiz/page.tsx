'use client';
import BottomBar from "@/components/bottomBar";
import HeaderBar from "@/components/headerBar";
import QuizGridView from "@/components/quizGridView";
import Quiz from "@/types/quiz";

const quizzes: Quiz[] = [];

export default function Quizzes() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-[#12121B]">
      <HeaderBar bgColor={'12121B'}/>
      <div className="h-40"/>
      <h1 className="text-5xl">Seus Quizzes</h1>
      <div className="h-10"/>
      <QuizGridView quizzes={quizzes} />
      <BottomBar bgColor={'12121B'}/>
    </main>
  );
}
