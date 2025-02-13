import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import QuestionEdit from "@/components/QuestionEdit";

const mockQuestion = {
  id: "1",
  statement: "Qual é a capital da França?",
  options: ["Paris", "Londres", "Roma", "Madri"],
  correctAnswer: "0", // A resposta correta é 'Paris', index 0
  questionType: "MULTIPLE_CHOICE",
  hint: "É uma cidade famosa pela Torre Eiffel.",
  explanation:
    "Paris é a capital da França, localizada no centro-norte do país.",
};

const mockOnSave = jest.fn();

describe("QuestionEdit Component", () => {
  it("deve alterar a opção de múltipla escolha", () => {
    render(<QuestionEdit question={mockQuestion} onSave={mockOnSave} />);

    const optionInputs = screen.getAllByRole("textbox");
    fireEvent.change(optionInputs[1], { target: { value: "Barcelona" } });

    expect(optionInputs[1]).toHaveValue("Barcelona");
  });
});
