"use client"

import { createContext, ReactNode, useState } from "react";

type questionTypes = "TRUE_OR_FALSE" | "MULTIPLE_CHOICE"

interface QuizContextInterface {
    quiz: {
        title: string,
        description: string,
        questions: {
            questionType: questionTypes,
            statement: string,
            hint: string,
            explanation: string,
            correctAnswer: number | boolean,
            options: string[]
        }[],
    }
    setQuiz: (quiz: QuizContextInterface["quiz"]) => void
}

export const defaultContextValue: QuizContextInterface = {
    quiz: {
        "title": "",
        "description": "",
        "questions": [],
    },
    setQuiz: (quiz) => {},
  }

const QuizContext = createContext<QuizContextInterface>(defaultContextValue);

const QuizContextProvider = ({ children }: { children: ReactNode }) => {
    const [quiz, setQuiz] = useState<QuizContextInterface["quiz"]>(defaultContextValue["quiz"]);


    return (
        <QuizContext.Provider value={{quiz, setQuiz}}>
            {children}
        </QuizContext.Provider>
    )
}

export default QuizContext;
export { QuizContextProvider };