import Card_pokemon from "../Components/Cards.jsx";

const pokeapi = "https://pokeapi.co/api/v2/pokemon/"



async function GETPOKEMON(qtd=100) {
    const url_qtd = `${pokeapi}?limit=${qtd}`;
    console.log("realizando busca na url: "+ url_qtd);
    try {
        let resposta = await fetch(url_qtd);
        if (!resposta.ok) {
            throw new Error(`Erro: ${resposta.status}`);
        }
        return await resposta.json();
    }catch (erro) {
        console.log("ERRO DE REQUISIÇÃO HTTP: " + erro);
    }
}
export default GETPOKEMON;