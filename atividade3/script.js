const btnIniciar = document.getElementById("INICIAR");
const btnParar = document.getElementById("PARAR");
const inputNome = document.getElementById("nome");
const inimigo = document.getElementById("inimigo");
const listaJogador = document.getElementById("lista_jogador");

let jogoAtivo = false;
let scoreJogador = 0;
let maxScore = 0;

let jogadorAtual = null;
let jogadores = [];

btnIniciar.addEventListener("click", iniciar);
btnParar.addEventListener("click", parar);
inimigo.addEventListener("click", clicarNoInimigo);

function iniciar() {
    const nome = inputNome.value.trim();

    if (nome === "") {
        alert("Digite um nome para iniciar o jogo.");
        inputNome.focus();
        return;
    }

    jogoAtivo = true;
    scoreJogador = 0;

    jogadorAtual = {
        nome: nome,
        score: scoreJogador
    };

    jogadores.push(jogadorAtual);

    btnIniciar.style.display = "none";
    btnParar.style.display = "block";
    inimigo.style.display = "block";

    randomizaPosicaoInimigo();
    atualizarUI();

    console.log("Jogo iniciado!");
}

function parar() {
    jogoAtivo = false;

    btnIniciar.style.display = "block";
    btnParar.style.display = "none";
    inimigo.style.display = "none";

    atualizarUI();

    console.log("Jogo parado!");
}

function clicarNoInimigo() {
    if (!jogoAtivo) return;

    scoreJogador++;

    if (jogadorAtual !== null) {
        jogadorAtual.score = scoreJogador;
    }

    verificaScore(scoreJogador);
    randomizaPosicaoInimigo();
    atualizarUI();

    console.log("Score:", scoreJogador);
}

function verificaScore(score) {
    if (score > maxScore) {
        maxScore = score;
    }
}

function randomizaPosicaoInimigo() {
    const areaDoJogo = document.querySelector(".area_do_jogo");

    const larguraArea = areaDoJogo.clientWidth;
    const alturaArea = areaDoJogo.clientHeight;

    const larguraInimigo = inimigo.offsetWidth;
    const alturaInimigo = inimigo.offsetHeight;

    const limiteX = larguraArea - larguraInimigo;
    const limiteY = alturaArea - alturaInimigo;

    const randomX = Math.floor(Math.random() * limiteX);
    const randomY = Math.floor(Math.random() * limiteY);

    inimigo.style.left = randomX + "px";
    inimigo.style.top = randomY + "px";
}

function atualizarUI() {
    const placarJogador = document.querySelector(".placar_jogador");
    const placarCpu = document.querySelector(".placar_cpu");
    const placarGeral = document.getElementById("placar_de_jogadores");

    if (placarJogador) {
        placarJogador.textContent = `Score: ${scoreJogador}`;
    }

    if (placarCpu) {
        placarCpu.textContent = `Recorde: ${maxScore}`;
    }

    if (placarGeral) {
        placarGeral.textContent = `Recorde geral: ${maxScore}`;
    }

    listaJogador.innerHTML = "";

    jogadores.forEach((jogador, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${jogador.nome} - ${jogador.score}`;
        listaJogador.appendChild(li);
    });
}