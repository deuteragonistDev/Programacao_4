import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Search_bar from "./Components/Search_bar.jsx";
import Card_pokemon from "./Components/Cards.jsx";

function App() {
    // Estado central que guarda os Pokémons buscados
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    return (
        <div className="py-4 bg-dark text-white shadow" style={{ minHeight: '100vh' }}>
            <h1 className="text-center text-info mb-4" style={{ fontFamily: 'Orbitron' }}>POKÉDEX </h1>

            {/* Passamos as funções para a barra de pesquisa poder atualizar o "cérebro" */}
            <Search_bar
                onResult={(dados) => setPokemonList(dados)}
                onError={(msg) => setErro(msg)}
                setLoading={setLoading}
            />

            {/* Tratamento de Erros e Carregamento */}
            {loading && <p className="text-center text-warning mt-3">Buscando na rede...</p>}
            {erro && <p className="text-center text-danger mt-3"> {erro}</p>}

            {/* Grid dinâmica desenhando os cartões */}
            <div className="row mt-4 d-flex justify-content-center">
                {pokemonList.map((poke) => (
                    <div key={poke.id} className="col-auto mb-4">
                        <Card_pokemon pokemon={poke} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;