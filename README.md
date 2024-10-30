# YouTube Quiz App

Este é um projeto de um **Quiz App** baseado em perguntas de múltipla escolha e verdadeiro/falso, desenvolvido utilizando **Next.js** e **Tailwind CSS**. O aplicativo permite aos usuários inserir um link de vídeo do YouTube e responder às perguntas de um quiz baseado no vídeo enviado.

## Funcionalidades

- **Validação de URL do YouTube**: O usuário pode inserir uma URL do YouTube, que é validada antes de prosseguir.
- **Quiz interativo**: Perguntas de múltipla escolha e verdadeiro/falso, com feedback visual sobre a resposta correta.
  
## Tecnologias utilizadas

- [**Next.js**](https://nextjs.org/) - Framework React para renderização no lado do servidor e geração de sites estáticos.
- [**Tailwind CSS**](https://tailwindcss.com/) - Framework CSS utilitário para estilização rápida.
- [**TypeScript**](https://www.typescriptlang.org/) - Superset de JavaScript que adiciona tipagem estática.

## Como rodar o projeto
Siga os passos abaixo para rodar o projeto localmente:

#### Clone o repositório:

```bash
git clone https://github.com/seu-usuario/quiz-app.git
```
#### Navegue até o diretório do projeto:

```bash
cd quiz-app
```
#### Instale as dependências:

Certifique-se de ter o Node.js instalado e, em seguida, execute:

```bash
npm install
```
#### Rodando o servidor de desenvolvimento:

Para iniciar o servidor de desenvolvimento, execute o comando abaixo:

```bash
npm run dev
```
O aplicativo estará disponível em http://localhost:3000.

## Como usar
Na página inicial, insira uma URL de vídeo válida do YouTube na barra de input.\
Após a validação bem-sucedida, o quiz será exibido.\
Responda às perguntas e envie suas respostas.\
O feedback visual indicará se as respostas estão corretas ou não.\
Use o botão "Voltar" para retornar à barra de input e reiniciar o processo.

## Melhorias futuras
- Suporte a diferentes tipos de quiz e mais categorias de perguntas.
- Armazenamento do progresso e pontuação do usuário.

## Licença
Este projeto é licenciado sob a MIT License.