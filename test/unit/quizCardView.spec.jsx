import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizCardView from '@/components/quizCardView';
import { useRouter } from 'next/navigation';

// Mock do useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const quiz = {"id":"07db52bc-67e1-4e25-ba97-70d84e3c8b70","title":"Quiz sobre Multithreading e Processos","description":"Teste seus conhecimentos sobre a execução de processos e threads com as perguntas abaixo.","questions":[{"id":"0ed5c089-c93a-40f6-b236-a39af0af170b","questionType":"MULTIPLE_CHOICE","statement":"O que é um processo?","hint":"É uma unidade de execução de um programa.","explanation":"Um processo é uma sequência de instruções em execução, que inclui seu próprio espaço de memória, variáveis e recursos.","correctAnswer":"0","quizId":"07db52bc-67e1-4e25-ba97-70d84e3c8b70","options":["Uma unidade de execução de um programa","Um tipo de memória","Um arquivo de sistema","Um dispositivo de entrada"]},{"id":"a481f6a7-9d4d-4721-923d-645145519681","questionType":"MULTIPLE_CHOICE","statement":"O que são threads?","hint":"É um recurso que permite a execução simultânea de várias partes de um programa.","explanation":"Threads permitem que um único processo execute múltiplas sequências de comandos simultaneamente, economizando recursos e tempo.","correctAnswer":"0","quizId":"07db52bc-67e1-4e25-ba97-70d84e3c8b70","options":["São linhas de execução dentro de um processo","Um tipo de processo","Tipos de arquivos","Um recurso de entrada/saída"]},{"id":"5380cbea-54a1-4589-a89e-9148e730ca84","questionType":"TRUE_OR_FALSE","statement":"Threads compartilham recursos de memória dentro de um processo.","hint":"Pense no que é um processo e seus componentes.","explanation":"Verdadeiro. Todas as threads dentro de um processo compartilham o mesmo espaço de memória, variáveis e arquivos abertos.","correctAnswer":"true","quizId":"07db52bc-67e1-4e25-ba97-70d84e3c8b70","options":[""]},{"id":"92b95dea-4ac8-4c4a-abb4-a342fb0d6225","questionType":"MULTIPLE_CHOICE","statement":"Qual é a vantagem de usar multithreading?","hint":"Considere eficiência e uso de recursos.","explanation":"Multithreading permite que um programa execute múltiplas tarefas ao mesmo tempo, melhorando o desempenho em sistemas com múltiplos CPUs.","correctAnswer":"0","quizId":"07db52bc-67e1-4e25-ba97-70d84e3c8b70","options":["Aumenta o desempenho do programa","Reduz a segurança do sistema","Diminui a eficiências do processo","Aumenta o uso de memória"]},{"id":"db29e670-4269-450a-acf9-1e33621d7074","questionType":"TRUE_OR_FALSE","statement":"Em um sistema de multithreading, um programa pode ser bloqueado enquanto outro thread é executado.","hint":"Considere o que acontece quando as threads estão trabalhando.","explanation":"Falso. Em um sistema de multithreading, enquanto uma thread está executando, outras podem continuar a operar, evitando bloqueios.","correctAnswer":"false","quizId":"07db52bc-67e1-4e25-ba97-70d84e3c8b70","options":[""]},{"id":"a0172786-70a7-410c-9b5c-1fd97de50988","questionType":"MULTIPLE_CHOICE","statement":"Qual é um exemplo de aplicação prática de multithreading?","hint":"Pense em editores de texto ou servidores.","explanation":"Um editor de texto que verifica ortografia enquanto o usuário digita é um exemplo prático de multithreading.","correctAnswer":"0","quizId":"07db52bc-67e1-4e25-ba97-70d84e3c8b70","options":["Um editor de texto que corrige a ortografia em segundo plano","Um aplicativo de notepad simples","Um sistema de arquivos","Um jogo single-player"]},{"id":"36c7e28f-bad3-4824-8616-af7f0134c8fd","questionType":"MULTIPLE_CHOICE","statement":"O que acontece em uma implementação monothread quando um arquivo grande é processado?","hint":"Lembre-se do fluxo de controle no processamento de arquivos.","explanation":"O usuário ficará esperando até que o arquivo grande seja processado, pois a thread única bloqueia a entrada do usuário.","correctAnswer":"0","quizId":"07db52bc-67e1-4e25-ba97-70d84e3c8b70","options":["O usuário fica bloqueado até o processamento ser concluído","O arquivo é processado mais rápido que em sistemas multithread","O sistema falha","Um erro é retornado imediatamente"]},{"id":"b450ceab-b421-442d-80a3-da2e0a9abb57","questionType":"TRUE_OR_FALSE","statement":"Uma thread pode ser criada a partir de um processo existente.","hint":"Pense sobre a relação entre processos e threads.","explanation":"Verdadeiro. Threads são criadas dentro de processos existentes para executar tarefas específicas.","correctAnswer":"true","quizId":"07db52bc-67e1-4e25-ba97-70d84e3c8b70","options":[""]},{"id":"67ebbffa-5d29-4d1d-990f-1045b058db16","questionType":"MULTIPLE_CHOICE","statement":"Qual é o estado de uma thread que aguarda um recurso?","hint":"Pense nos diferentes estados de execução.","explanation":"Uma thread que espera por um recurso entra em estado de espera até que o recurso esteja disponível.","correctAnswer":"0","quizId":"07db52bc-67e1-4e25-ba97-70d84e3c8b70","options":["Esperando","Executando","Pronta","Terminada"]},{"id":"ff8f679f-0997-4c18-b7fd-22f8b1ef4839","questionType":"TRUE_OR_FALSE","statement":"Threads e processos compartilham os mesmos estados de execução.","hint":"Considere o que são estados de execução.","explanation":"Verdadeiro. Threads têm estados semelhantes aos processos, como pronto, executando, e bloqueado.","correctAnswer":"true","quizId":"07db52bc-67e1-4e25-ba97-70d84e3c8b70","options":[""]}],"sourceType":"YOUTUBE_VIDEO","sourceUri":"aRFKL7nSpts","userId":"594133bb-b13c-4e55-95e0-505e000b085f","attempts":null}

describe('QuizCardView Component', () => {
  it('renderiza corretamente', () => {
    render(<QuizCardView quiz={quiz} />);
    
    expect(screen.getByText(quiz.title)).toBeInTheDocument();
    expect(screen.getByText('Video original:')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'a' && content.includes(quiz.sourceUri);
    })).toBeInTheDocument();
    expect(screen.getByText(`Número de Questões: ${quiz.questions.length}`)).toBeInTheDocument();
    if (quiz.attempts && quiz.attempts.length > 0) {
      expect(screen.getByText(quiz.attempts[0].score.toString())).toBeInTheDocument();
      expect(screen.getByText('Tempo gasto:')).toBeInTheDocument();
      expect(screen.getByText(`${quiz.attempts[0].timeSpent}m`)).toBeInTheDocument();
      expect(screen.getByText(`Criado em: ${new Date(quiz.attempts[0].completionDate).toLocaleDateString('pt-BR')}`)).toBeInTheDocument();
      expect(screen.getByText(`Editado em: ${new Date(quiz.attempts[0].completionDate).toLocaleDateString('pt-BR')}`)).toBeInTheDocument();
      expect(screen.getByText('Realizado em:')).toBeInTheDocument();
      expect(screen.getByText(new Date(quiz.attempts[0].completionDate).toLocaleDateString('pt-BR'))).toBeInTheDocument();
    } else {
      expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);
    }
  });

  it('navega para a página de detalhes ao clicar no link de detalhes', () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });

    render(<QuizCardView quiz={quiz} />);
    
    const detailsLink = screen.getByText('Detalhes');
    fireEvent.click(detailsLink);

    expect(push).toHaveBeenCalledWith(`/quiz/${quiz.id}`);
  });

  it('verifica se o link do vídeo original está presente e se possui o atributo href correto', () => {
    render(<QuizCardView quiz={quiz} />);
    
    const videoLink = screen.getByText(quiz.sourceUri);
    expect(videoLink.closest('a')).toHaveAttribute('href', `https://www.youtube.com/watch?v=${quiz.sourceUri}`);
  });
});
