describe("E2E Test - Envio de link e verificação do botão", () => {
  it("Deve enviar um link do YouTube e verificar se o botão 'Enviar Respostas' está presente", () => {
    // Visita a página principal
    cy.visit("/");
    
    // Digita a URL do vídeo no campo de input
    cy.get("input[type='text']").type("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    
    // Clica no botão de envio
    cy.get("button").click();
    
    // Verifica se o botão 'Enviar Respostas' está presente na página
    cy.contains("button", "Enviar Respostas").should("be.visible");
  });
});