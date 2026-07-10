const btnIniciar = document.getElementById("INICIAR");
const btnParar = document.getElementById("PARAR");
const inputNome = document.getElementById("nome");
const inimigo = document.getElementById("inimigo");
const listaJogador = document.getElementById("lista_jogador");
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let jogoAtivo = false;
let scoreJogador = 0;
let maxScore = 0;
let score_yami = 0;

let timerId = null;

let jogadorAtual = null;
let jogadores = [];
let clicou = false;

btnIniciar.addEventListener("click", iniciar);
btnParar.addEventListener("click", parar);
inimigo.addEventListener("click", clicarNoInimigo);

function iniciar() {
    const nome = inputNome.value.trim();
    score_yami = 0;
    if (nome === "") {
        alert("Digite um nome para iniciar o jogo.");
        inputNome.focus();
        return;
    }

    jogoAtivo = true;
    scoreJogador = 0;

    jogo_rodando()

    jogadorAtual = {
        nome: nome,
        score: scoreJogador
    };

    jogadores.push(jogadorAtual);

    btnIniciar.style.display = "none";
    btnParar.style.display = "block";
    inimigo.style.display = "block";
    
    atualizarUI();
    esperar();

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

async function clicarNoInimigo() {
    if (!jogoAtivo || clicou) return; // Evita cliques extras na mesma rodada
    clicou = true;
    scoreJogador++;


    if (timerId) clearTimeout(timerId);

    if (jogadorAtual !== null) {
        jogadorAtual.score = scoreJogador;
    }

    verificaScore(scoreJogador);
    randomizaPosicaoInimigo();
    atualizarUI();
    jogo_rodando();

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
    const areaDoPlacar = document.querySelector(".placar_geral");


    if (placarJogador) {
        placarJogador.textContent = `Score: ${scoreJogador} Recorde: ${maxScore}`;
        placarJogador.style.position = 'absolute';
        placarJogador.style.top = '10px';
        placarJogador.style.fontSize = '24px';
        placarJogador.style.color = 'black';
        placarJogador.style.fontFamily = 'Arial, sans-serif';
        placarJogador.style.fontWeight = 'bold';
        placarJogador.style.padding = '5px'

    }

    if (placarCpu) {
        placarCpu.textContent = `Yami: ${score_yami}`;
        placarCpu.style.position = 'absolute';
        placarCpu.style.top = '35px';
        placarCpu.style.fontSize = '24px';
        placarCpu.style.color = 'black';
        placarCpu.style.fontFamily = 'Arial, sans-serif';
        placarCpu.style.fontWeight = 'bold';
        placarCpu.style.padding = '5px'
    }

    if (areaDoPlacar) {
        areaDoPlacar.style.display = 'flex';
        areaDoPlacar.style.flexDirection = 'column';
        areaDoPlacar.style.border = '2px solid black';
        areaDoPlacar.style.borderRadius = '10px';
        areaDoPlacar.style.flexWrap = 'wrap';
        areaDoPlacar.style.position = 'fixed';
        areaDoPlacar.style.width = '15vw';
        areaDoPlacar.style.height = '20vh';
        areaDoPlacar.style.alignItems = 'flex-start';

        areaDoPlacar.style.backgroundColor = 'white';
        areaDoPlacar.style.pointerEvents = 'none';
        areaDoPlacar.style.marginLeft = '80dvw';
        areaDoPlacar.style.marginTop = '10dvh';
        areaDoPlacar.style.padding = '10px';
        areaDoPlacar.style.zIndex = '20';
    }

    if (placarGeral) {
        placarGeral.textContent = `Recorde geral: ${maxScore}`;
        placarGeral.style.display = 'flex';
        placarGeral.style.fontSize = '24px';
        placarGeral.style.justifyContent = 'flex-start';
        placarGeral.style.alignItems = 'center';
        placarGeral.style.margin = '0px';
        placarGeral.style.width = '100%';
        placarGeral.style.fontFamily = 'Arial, sans-serif';
        placarGeral.style.fontWeight = 'bold';
        placarGeral.style.padding = '1px';
    }

    if (listaJogador) {
        listaJogador.innerHTML = "";
        listaJogador.style.paddingLeft = "0px";
        listaJogador.style.margin = "5px";
        listaJogador.style.width = "100%";
        jogadores.forEach((jogador, index) => {
            const li = document.createElement("li");
            li.textContent = `${jogador.nome} - ${jogador.score}`;
            li.style.fontFamily = 'Arial, sans-serif';
            li.style.fontSize = '15px';
            li.style.textAlign = 'left';
            li.style.listStyle = 'none';
            listaJogador.appendChild(li);
        });

    }

}

async function esperar() {
    const ojogo = document.querySelector(".O_JOGO");

    if (ojogo) {
        ojogo.innerHTML = "O JOGO INICIOU";
        await wait(2000);
        ojogo.innerHTML = "";

    }

}

async function jogo_rodando(){
    if(!jogoAtivo) return;
    clicou = false;


    await new Promise((resolve) => {
        timerId = setTimeout(() => {
            if (!clicou) {
                score_yami++;
                randomizaPosicaoInimigo();
                atualizarUI();
            }
            clearTimeout(timerId);
            resolve(); // Finaliza a espera de 2 segundos

        }, 2000);
    });

    await jogo_rodando()

}
