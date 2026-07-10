const Pokeapi = "https://pokeapi.co/api/v2/pokemon/"

async function GETPOKEMONbyname(name) {
    const url_name = `${Pokeapi}${name}`;
    console.log("realizando busca na url: "+ url_name);
    try {
        let resposta = await fetch(url_name);
        if (!resposta.ok) {
            throw new Error(`Erro: ${resposta.status}`);
        }
        return await resposta.json();
    }catch (erro) {
        console.log("ERRO NA REQUISIÇÃO HTTP: " + erro);
    }
}
export default GETPOKEMONbyname;