// js/app.js

const container = document.getElementById('container-personagens');

// 1. Função Assíncrona para buscar os dados do Back-end Node.js
async function carregarPersonagensDinamicos() {
  try {
    const resposta = await fetch('http://localhost:3000/api/conteudos');
    const dados = await resposta.json();

    if (!resposta.ok) throw new Error(dados.erro);

    // Limpa o container antes de renderizar
    container.innerHTML = '';

    // 2. Loop para injetar dinamicamente as seções no HTML
    dados.forEach(item => {
      // Cria a section clonando as classes de estilo originais do CSS
      const secao = document.createElement('section');
      secao.className = `personagem-individual-tela-inteira`;
      secao.id = item.titulo.toLowerCase().replace(/\s+/g, '-');

      // Injeta a variável de imagem na propriedade CSS customizada de fundo (Parallax)
      secao.style.setProperty('--imagem-fundo-principal', `url("${item.imagem}")`);
      secao.style.setProperty('--imagem-parallax', `url("${item.imagem}")`);

      secao.innerHTML = `
                <div class="conteudo-personagem">
                    <div class="texto-personagem">
                        <h3 class="nome-do-personagem-destaque">${item.titulo}</h3>
                        <p class="biografia-resumida">${item.texto}</p>
                    </div>
                </div>
            `;

      container.appendChild(secao);
    });

    // 3. Reativa o IntersectionObserver original para manter a animação cyberpunk funcionando
    ativarAnimacoesScroll();

  } catch (erro) {
    console.error("Erro ao conectar com a API Cyberpunk:", erro);
    container.innerHTML = `<p style="color:red; text-align:center; padding:50px;">Falha na sincronização com Night City: ${erro.message}</p>`;
  }
}

// Mantém a sua lógica original de animação ao rolar a tela, mas agora aplicada aos elementos do banco
function activarAnimacoesScroll() {
  const secoesDinamicas = document.querySelectorAll('.personagem-individual-tela-inteira');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('animar');
        setTimeout(() => {
          entry.target.classList.add('animar');
        }, 50);
      } if (!entry.isIntersecting) {
        entry.target.classList.remove('animar');
      }
    });
  }, { threshold: 0.6 });

  secoesDinamicas.forEach(secao => observer.observe(secao));
}

// Dispara a carga assim que a página abre no navegador
document.addEventListener('DOMContentLoaded', carregarPersonagensDinamicos);
