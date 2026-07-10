import Card_pokemon from "../Components/Cards.jsx";

const Pokeapi = "https://pokeapi.co/api/v2/pokemon/"

async function GETPOKEMONbyid(id) {
    const url_id = `${Pokeapi}${id}`;
    console.log("realizando busca na url: "+ url_id);
    try {
        let resposta = await fetch(url_id);
        // Verifica se a requisição foi bem-sucedida
        if (!resposta.ok) {
            throw new Error(`Erro: ${resposta.status}`);
        }

        // Converte a resposta para JSON
        return await resposta.json().then(Card_pokemon(resposta));
    } catch (erro) {
        console.error("Erro na requisição:", erro);
    }
}
export default GETPOKEMONbyid;