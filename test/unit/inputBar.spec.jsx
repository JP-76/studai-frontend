import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InputBar from '@/components/InputBar';


describe('InputBar Component', () => {

  it('renderiza corretamente', () => {
    render(<InputBar onSubmit={jest.fn()} handleQuiz={jest.fn()} />);
    
    expect(screen.getByPlaceholderText("Ex.: https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBeInTheDocument();
  });

  it('permite que o usuário digite no campo de entrada', () => {
    render(<InputBar onSubmit={jest.fn()} handleQuiz={jest.fn()} />);
    
    const input = screen.getByPlaceholderText("Ex.: https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    fireEvent.change(input, { target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } });

    expect(input).toHaveValue('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  });

  it('exibe um toast para URLs inválidas', async () => {
    render(<InputBar onSubmit={jest.fn()} handleQuiz={jest.fn()} />);
    
    const input = screen.getByPlaceholderText("Ex.: https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    fireEvent.change(input, { target: { value: 'invalid_url' } });

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText("A URL fornecida não é um link válido do YouTube.")).toBeInTheDocument();
    });
  });  
});
